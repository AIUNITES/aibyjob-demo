/**
 * Google Apps Script - Maps Business Finder
 * Deploy as Web App to call from AIByJob
 * 
 * SETUP:
 * 1. Go to script.google.com
 * 2. Create new project
 * 3. Paste this code
 * 4. Enable "Places API" in Google Cloud Console
 * 5. Deploy > New Deployment > Web App
 * 6. Set "Who has access" to "Anyone"
 * 7. Copy the web app URL
 */

// Your Google Cloud API Key (with Places API enabled)
const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Business Finder API is running. Use POST to search.'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const { action, location, industry, maxResults } = params;
    
    let result;
    
    switch (action) {
      case 'findNoWebsite':
        result = findBusinessesWithoutWebsites(location, industry, maxResults || 20);
        break;
      case 'findNoEcommerce':
        result = findRetailWithoutEcommerce(location, industry, maxResults || 20);
        break;
      default:
        result = { error: 'Unknown action' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Find businesses without websites using Places API
 */
function findBusinessesWithoutWebsites(location, industry, maxResults) {
  const businesses = [];
  const query = `${industry} in ${location}`;
  
  // Text Search to find businesses
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
  
  const searchResponse = UrlFetchApp.fetch(searchUrl);
  const searchData = JSON.parse(searchResponse.getContentText());
  
  if (searchData.status !== 'OK') {
    return { error: searchData.status, businesses: [] };
  }
  
  // Check each place for website
  for (const place of searchData.results.slice(0, maxResults * 2)) {
    // Get place details (includes website field)
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,business_status,types,opening_hours&key=${API_KEY}`;
    
    const detailsResponse = UrlFetchApp.fetch(detailsUrl);
    const detailsData = JSON.parse(detailsResponse.getContentText());
    
    if (detailsData.status === 'OK') {
      const details = detailsData.result;
      
      // Only include if NO website
      if (!details.website) {
        businesses.push({
          name: details.name,
          address: details.formatted_address,
          phone: details.formatted_phone_number || 'N/A',
          rating: details.rating || 0,
          reviews: details.user_ratings_total || 0,
          hasWebsite: false,
          placeId: place.place_id,
          types: details.types || [],
          isOpen: details.opening_hours?.open_now || null,
          googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
        });
        
        if (businesses.length >= maxResults) break;
      }
    }
    
    // Rate limiting - be nice to the API
    Utilities.sleep(100);
  }
  
  return {
    query: query,
    totalFound: businesses.length,
    businesses: businesses
  };
}

/**
 * Find retail stores without e-commerce
 * (checks for common e-commerce indicators)
 */
function findRetailWithoutEcommerce(location, storeType, maxResults) {
  const stores = [];
  
  // Map store types to search queries
  const typeQueries = {
    'boutique': 'clothing boutique',
    'gifts': 'gift shop',
    'specialty': 'specialty food store',
    'crafts': 'craft store',
    'jewelry': 'jewelry store',
    'home': 'home goods store'
  };
  
  const query = `${typeQueries[storeType] || storeType} in ${location}`;
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
  
  const searchResponse = UrlFetchApp.fetch(searchUrl);
  const searchData = JSON.parse(searchResponse.getContentText());
  
  if (searchData.status !== 'OK') {
    return { error: searchData.status, stores: [] };
  }
  
  for (const place of searchData.results.slice(0, maxResults * 2)) {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types&key=${API_KEY}`;
    
    const detailsResponse = UrlFetchApp.fetch(detailsUrl);
    const detailsData = JSON.parse(detailsResponse.getContentText());
    
    if (detailsData.status === 'OK') {
      const details = detailsData.result;
      
      // Check if website exists and if it has e-commerce
      let hasEcommerce = false;
      
      if (details.website) {
        // Quick check - does the website have e-commerce indicators?
        try {
          const siteResponse = UrlFetchApp.fetch(details.website, {
            muteHttpExceptions: true,
            followRedirects: true
          });
          const siteContent = siteResponse.getContentText().toLowerCase();
          
          // Look for e-commerce indicators
          hasEcommerce = siteContent.includes('add to cart') ||
                        siteContent.includes('add-to-cart') ||
                        siteContent.includes('shopify') ||
                        siteContent.includes('woocommerce') ||
                        siteContent.includes('bigcommerce') ||
                        siteContent.includes('squarespace/commerce') ||
                        siteContent.includes('checkout') ||
                        siteContent.includes('shopping cart');
        } catch (e) {
          // Couldn't fetch website, assume no e-commerce
          hasEcommerce = false;
        }
      }
      
      // Only include if no e-commerce
      if (!hasEcommerce) {
        stores.push({
          name: details.name,
          address: details.formatted_address,
          phone: details.formatted_phone_number || 'N/A',
          rating: details.rating || 0,
          reviews: details.user_ratings_total || 0,
          hasWebsite: !!details.website,
          website: details.website || null,
          hasEcommerce: false,
          placeId: place.place_id,
          types: details.types || [],
          googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
        });
        
        if (stores.length >= maxResults) break;
      }
    }
    
    Utilities.sleep(200); // Rate limiting
  }
  
  return {
    query: query,
    totalFound: stores.length,
    stores: stores
  };
}

/**
 * Test function - run in script editor
 */
function testSearch() {
  const result = findBusinessesWithoutWebsites('Austin, TX', 'restaurants', 5);
  Logger.log(JSON.stringify(result, null, 2));
}
