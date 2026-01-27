"""
AIByJob - Google Maps Business Finder API
Python Flask Backend

SETUP:
1. pip install flask flask-cors requests python-dotenv
2. Create .env file with GOOGLE_MAPS_API_KEY=your_key
3. python app.py
4. API runs at http://localhost:5000

DEPLOY OPTIONS:
- Render.com (free tier)
- Railway.app (free tier)
- Fly.io (free tier)
- PythonAnywhere (free tier)
"""

import os
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'


@app.route('/')
def home():
    return jsonify({
        'status': 'ok',
        'message': 'AIByJob Business Finder API',
        'endpoints': {
            '/api/find-no-website': 'POST - Find businesses without websites',
            '/api/find-no-ecommerce': 'POST - Find retail stores without e-commerce'
        }
    })


@app.route('/api/find-no-website', methods=['POST'])
def find_no_website():
    """Find businesses in a location that don't have websites"""
    data = request.json
    location = data.get('location', 'Austin, TX')
    industry = data.get('industry', 'restaurants')
    max_results = int(data.get('maxResults', 15))
    
    businesses = []
    query = f"{industry} in {location}"
    
    # Step 1: Text Search for businesses
    search_url = f"{PLACES_BASE_URL}/textsearch/json"
    search_params = {
        'query': query,
        'key': API_KEY
    }
    
    search_response = requests.get(search_url, params=search_params)
    search_data = search_response.json()
    
    if search_data.get('status') != 'OK':
        return jsonify({
            'error': search_data.get('status'),
            'message': search_data.get('error_message', 'Search failed'),
            'businesses': []
        })
    
    # Step 2: Get details for each place
    for place in search_data.get('results', [])[:max_results * 2]:
        place_id = place.get('place_id')
        
        # Get place details
        details_url = f"{PLACES_BASE_URL}/details/json"
        details_params = {
            'place_id': place_id,
            'fields': 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,business_status,types,opening_hours',
            'key': API_KEY
        }
        
        details_response = requests.get(details_url, params=details_params)
        details_data = details_response.json()
        
        if details_data.get('status') == 'OK':
            result = details_data.get('result', {})
            
            # Only include if NO website
            if not result.get('website'):
                businesses.append({
                    'name': result.get('name'),
                    'address': result.get('formatted_address'),
                    'phone': result.get('formatted_phone_number', 'N/A'),
                    'rating': result.get('rating', 0),
                    'reviews': result.get('user_ratings_total', 0),
                    'hasWebsite': False,
                    'placeId': place_id,
                    'types': result.get('types', []),
                    'category': get_primary_category(result.get('types', [])),
                    'isOpen': result.get('opening_hours', {}).get('open_now'),
                    'googleMapsUrl': f"https://www.google.com/maps/place/?q=place_id:{place_id}",
                    'opportunityScore': calculate_opportunity_score(result)
                })
                
                if len(businesses) >= max_results:
                    break
        
        # Rate limiting
        time.sleep(0.1)
    
    # Sort by opportunity score
    businesses.sort(key=lambda x: x['opportunityScore'], reverse=True)
    
    return jsonify({
        'query': query,
        'location': location,
        'industry': industry,
        'totalFound': len(businesses),
        'businesses': businesses
    })


@app.route('/api/find-no-ecommerce', methods=['POST'])
def find_no_ecommerce():
    """Find retail stores without e-commerce presence"""
    data = request.json
    location = data.get('location', 'Denver, CO')
    store_type = data.get('storeType', 'boutique')
    max_results = int(data.get('maxResults', 15))
    
    # Map store types to search queries
    type_queries = {
        'boutique': 'clothing boutique',
        'gifts': 'gift shop',
        'specialty': 'specialty food store',
        'crafts': 'craft store arts crafts',
        'jewelry': 'jewelry store',
        'home': 'home goods furniture store'
    }
    
    stores = []
    query = f"{type_queries.get(store_type, store_type)} in {location}"
    
    # Search for stores
    search_url = f"{PLACES_BASE_URL}/textsearch/json"
    search_params = {
        'query': query,
        'key': API_KEY
    }
    
    search_response = requests.get(search_url, params=search_params)
    search_data = search_response.json()
    
    if search_data.get('status') != 'OK':
        return jsonify({
            'error': search_data.get('status'),
            'stores': []
        })
    
    for place in search_data.get('results', [])[:max_results * 2]:
        place_id = place.get('place_id')
        
        details_url = f"{PLACES_BASE_URL}/details/json"
        details_params = {
            'place_id': place_id,
            'fields': 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types',
            'key': API_KEY
        }
        
        details_response = requests.get(details_url, params=details_params)
        details_data = details_response.json()
        
        if details_data.get('status') == 'OK':
            result = details_data.get('result', {})
            website = result.get('website')
            
            # Check for e-commerce
            has_ecommerce = False
            if website:
                has_ecommerce = check_for_ecommerce(website)
            
            # Only include if no e-commerce
            if not has_ecommerce:
                stores.append({
                    'name': result.get('name'),
                    'address': result.get('formatted_address'),
                    'phone': result.get('formatted_phone_number', 'N/A'),
                    'rating': result.get('rating', 0),
                    'reviews': result.get('user_ratings_total', 0),
                    'hasWebsite': bool(website),
                    'website': website,
                    'hasEcommerce': False,
                    'placeId': place_id,
                    'types': result.get('types', []),
                    'category': get_primary_category(result.get('types', [])),
                    'googleMapsUrl': f"https://www.google.com/maps/place/?q=place_id:{place_id}",
                    'ecomPotential': calculate_ecom_potential(result, store_type),
                    'suggestedPlatform': suggest_platform(store_type)
                })
                
                if len(stores) >= max_results:
                    break
        
        time.sleep(0.2)  # Rate limiting
    
    # Sort by e-commerce potential
    potential_order = {'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1}
    stores.sort(key=lambda x: potential_order.get(x['ecomPotential'], 0), reverse=True)
    
    return jsonify({
        'query': query,
        'location': location,
        'storeType': store_type,
        'totalFound': len(stores),
        'stores': stores
    })


def check_for_ecommerce(website_url):
    """Check if a website has e-commerce functionality"""
    try:
        response = requests.get(website_url, timeout=5, headers={
            'User-Agent': 'Mozilla/5.0 (compatible; AIByJob/1.0)'
        })
        content = response.text.lower()
        
        # E-commerce indicators
        indicators = [
            'add to cart', 'add-to-cart', 'addtocart',
            'shopify', 'woocommerce', 'bigcommerce',
            'squarespace/commerce', 'magento',
            'checkout', 'shopping cart', 'shopping-cart',
            'buy now', 'purchase', 'shop now'
        ]
        
        return any(indicator in content for indicator in indicators)
    except:
        return False


def calculate_opportunity_score(place_data):
    """Calculate how good an opportunity this lead is (0-100)"""
    score = 50  # Base score
    
    rating = place_data.get('rating', 0)
    reviews = place_data.get('user_ratings_total', 0)
    
    # Higher rating = better opportunity
    if rating >= 4.5:
        score += 20
    elif rating >= 4.0:
        score += 15
    elif rating >= 3.5:
        score += 10
    
    # More reviews = established business
    if reviews >= 100:
        score += 20
    elif reviews >= 50:
        score += 15
    elif reviews >= 20:
        score += 10
    elif reviews >= 5:
        score += 5
    
    # Currently open = active business
    if place_data.get('opening_hours', {}).get('open_now'):
        score += 5
    
    return min(score, 100)


def calculate_ecom_potential(place_data, store_type):
    """Estimate e-commerce potential"""
    rating = place_data.get('rating', 0)
    reviews = place_data.get('user_ratings_total', 0)
    
    # High potential indicators
    if rating >= 4.0 and reviews >= 50:
        return 'Very High'
    elif rating >= 3.5 and reviews >= 20:
        return 'High'
    elif reviews >= 10:
        return 'Medium'
    return 'Low'


def suggest_platform(store_type):
    """Suggest best e-commerce platform based on store type"""
    platforms = {
        'boutique': 'Shopify',
        'gifts': 'Squarespace',
        'specialty': 'WooCommerce',
        'crafts': 'Etsy + Shopify',
        'jewelry': 'Shopify',
        'home': 'BigCommerce'
    }
    return platforms.get(store_type, 'Shopify')


def get_primary_category(types):
    """Get human-readable category from Google types"""
    category_map = {
        'restaurant': 'Restaurant',
        'cafe': 'Cafe',
        'bar': 'Bar',
        'bakery': 'Bakery',
        'clothing_store': 'Clothing Store',
        'jewelry_store': 'Jewelry Store',
        'home_goods_store': 'Home Goods',
        'furniture_store': 'Furniture Store',
        'beauty_salon': 'Beauty Salon',
        'hair_care': 'Hair Salon',
        'spa': 'Spa',
        'gym': 'Gym',
        'store': 'Retail Store'
    }
    
    for t in types:
        if t in category_map:
            return category_map[t]
    return 'Business'


if __name__ == '__main__':
    if not API_KEY:
        print("⚠️  WARNING: GOOGLE_MAPS_API_KEY not set in .env file")
        print("   Create a .env file with: GOOGLE_MAPS_API_KEY=your_key")
    
    print("🚀 Starting AIByJob Business Finder API...")
    print("   http://localhost:5000")
    app.run(debug=True, port=5000)
