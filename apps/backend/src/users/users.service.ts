import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findOrCreate(
    telegramId: string,
    username: string,
    firstName: string,
  ) {
    return this.supabaseService.findOrCreateUser(telegramId, username, firstName);
  }

  async updateBybitKeys(
    userId: string,
    apiKey: string,
    apiSecret: string,
  ) {
    return this.supabaseService.updateBybitKeys(userId, apiKey, apiSecret);
  }
} 