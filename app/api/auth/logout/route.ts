/*
 * ==========================================
 * 新文件: app/api/auth/logout/route.ts
 * ==========================================
 * 一个专门用于清除认证 cookie 的后端接口。
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  cookies().delete('token');
  return NextResponse.json({ message: '登出成功' });
}
