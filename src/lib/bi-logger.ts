/**
 * Smart Brew BI Logger Service
 * 
 * This service simulates a data ingestion pipeline for Business Intelligence (BI).
 * In a real-world scenario, this would send data to an event stream (like Kafka/Kinesis)
 * or directly to a data warehouse staging layer.
 * 
 * ============================================================================
 * 📊 DATABASE SCHEMA DOCUMENTATION (Star Schema / Data Warehouse Design)
 * ============================================================================
 * 
 * 1. Dimension Table: dim_users
 *    - user_id (UUID, Primary Key)
 *    - session_id (String, Indexed)
 *    - created_at (Timestamp)
 * 
 * 2. Dimension Table: dim_products
 *    - product_id (String, Primary Key)
 *    - name (String)
 *    - category (String)
 *    - base_price (Decimal)
 * 
 * 3. Fact Table: fact_interactions
 *    - interaction_id (UUID, Primary Key)
 *    - user_id (UUID, Foreign Key -> dim_users)
 *    - product_id (String, Foreign Key -> dim_products)
 *    - interaction_type (Enum: 'VIEW', 'CLICK', 'ADD_TO_CART')
 *    - timestamp (Timestamp)
 *    - user_agent (String)
 * 
 * 4. Fact Table: fact_customer_preferences
 *    - preference_id (UUID, Primary Key)
 *    - name (String)
 *    - email (String)
 *    - coffee_preference (Enum: 'Strong', 'Smooth', 'Milky')
 *    - special_request (Text) -> UNSTRUCTURED DATA (Requires NLP)
 *    - timestamp (Timestamp)
 * 
 * ============================================================================
 */

// Simulating a unique user/session ID for demonstration
const MOCK_USER_ID = "usr_" + Math.random().toString(36).substring(2, 9);

export type InteractionType = 'VIEW' | 'CLICK' | 'ADD_TO_CART';

export interface BIInteractionPayload {
  product_id: string;
  interaction_type: InteractionType;
}

export function logInteraction(payload: BIInteractionPayload) {
  const logEntry = {
    user_id: MOCK_USER_ID,
    product_id: payload.product_id,
    interaction_type: payload.interaction_type,
    timestamp: new Date().toISOString(),
  };

  // BI Visualization: Logging to console to demonstrate data generation
  console.log("%c[BI DATA INGESTION] Interaction Logged:", "color: #d4a373; font-weight: bold", JSON.stringify(logEntry, null, 2));
}

export interface BICustomerPreferencePayload {
  name: string;
  email: string;
  coffee_preference: 'Strong' | 'Smooth' | 'Milky';
  special_request?: string; // Unstructured data field
}

export function logCustomerPreference(payload: BICustomerPreferencePayload) {
  const logEntry = {
    ...payload,
    timestamp: new Date().toISOString(),
    _metadata: {
      unstructured_data_flag: !!payload.special_request,
      nlp_processing_required: !!payload.special_request,
    }
  };

  console.log("%c[BI DATA INGESTION] Customer Form Logged:", "color: #3b82f6; font-weight: bold", JSON.stringify(logEntry, null, 2));
  
  if (logEntry._metadata.nlp_processing_required) {
    console.warn("[BI NLP PIPELINE] Unstructured data detected in 'special_request'. Routing to NLP queue for sentiment and keyword analysis.");
  }
}
