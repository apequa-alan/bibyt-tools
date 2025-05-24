import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );
  }

  async findOrCreateUser(telegramId: string, username: string, firstName: string) {
    const { data: existingUser } = await this.supabase
      .from('users')
      .select()
      .eq('telegram_id', telegramId)
      .single();

    if (existingUser) {
      return existingUser;
    }

    const { data: newUser, error } = await this.supabase
      .from('users')
      .insert([
        {
          telegram_id: telegramId,
          username,
          first_name: firstName,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return newUser;
  }

  async updateBybitKeys(userId: string, apiKey: string, apiSecret: string) {
    const { data, error } = await this.supabase
      .from('users')
      .update({
        bybit_api_key_enc: apiKey,
        bybit_api_secret_enc: apiSecret,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
} 