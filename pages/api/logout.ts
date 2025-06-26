// pages/api/logout.ts
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const COOKIE_NAME = 'pichub_session';

  // 创建一个过期的、空的 cookie 来覆盖并清除现有的 session cookie
  const cookie = serialize(COOKIE_NAME, '', {
    maxAge: -1, // 设置为过去的时间，使其立即过期
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  res.redirect('/'); // 重定向到首页
}
