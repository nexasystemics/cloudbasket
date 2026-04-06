import { getSupabase } from '@/lib/supabase/get-client';

export interface TrackingEvent {
  id: string;
  orderId: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export async function getTrackingEvents(orderId: string): Promise<TrackingEvent[]> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('tracking_events')
    .select()
    .eq('order_id', orderId)
    .order('timestamp', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch tracking events: ${error.message}`);
  }

  return (data || []).map(mapTrackingEventFromDb);
}

export async function addTrackingEvent(
  orderId: string,
  status: string,
  location: string,
  description: string
): Promise<TrackingEvent> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('tracking_events')
    .insert([
      {
        order_id: orderId,
        status,
        location,
        description,
        timestamp: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add tracking event: ${error.message}`);
  }

  return mapTrackingEventFromDb(data);
}

export async function getLatestTrackingEvent(orderId: string): Promise<TrackingEvent | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('tracking_events')
    .select()
    .eq('order_id', orderId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch latest tracking event: ${error.message}`);
  }

  return data ? mapTrackingEventFromDb(data) : null;
}

function mapTrackingEventFromDb(dbEvent: any): TrackingEvent {
  return {
    id: dbEvent.id,
    orderId: dbEvent.order_id,
    status: dbEvent.status,
    location: dbEvent.location,
    timestamp: dbEvent.timestamp,
    description: dbEvent.description,
  };
}
