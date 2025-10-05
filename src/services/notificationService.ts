import { supabase } from '../lib/supabaseClient';

export interface Subscription {
  id: string;
  userId: string;
  plantaId?: string;
  regiaoId?: string;
  notificationType: 'email' | 'push' | 'sms';
  isActive: boolean;
}

export class NotificationService {
  static async subscribeToPlant(
    userId: string,
    plantaId: string,
    notificationType: 'email' | 'push' = 'email'
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('subscriptions').insert({
        user_id: userId,
        planta_id: plantaId,
        notification_type: notificationType,
        is_active: true
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error subscribing to plant:', error);
      return false;
    }
  }

  static async subscribeToRegion(
    userId: string,
    regiaoId: string,
    notificationType: 'email' | 'push' = 'email'
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('subscriptions').insert({
        user_id: userId,
        regiao_id: regiaoId,
        notification_type: notificationType,
        is_active: true
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error subscribing to region:', error);
      return false;
    }
  }

  static async unsubscribe(subscriptionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ is_active: false })
        .eq('id', subscriptionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return false;
    }
  }

  static async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plantas(*), regioes(*)')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }

  static async sendBloomNotification(
    plantName: string,
    regionName: string,
    daysUntilBloom: number
  ): Promise<void> {
    console.log(`Notification: ${plantName} in ${regionName} will bloom in ${daysUntilBloom} days`);
  }

  static async checkAndNotify(): Promise<void> {
    try {
      const { data: predictions } = await supabase
        .from('predictions')
        .select('*, plantas(*), regioes(*)')
        .gte('predicted_bloom_date', new Date().toISOString().split('T')[0])
        .lte('predicted_bloom_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (!predictions) return;

      for (const prediction of predictions) {
        const daysUntil = Math.floor(
          (new Date(prediction.predicted_bloom_date).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        );

        await this.sendBloomNotification(
          prediction.plantas.nome,
          prediction.regioes.nome,
          daysUntil
        );
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }
}
