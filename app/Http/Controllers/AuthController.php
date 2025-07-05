<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 显示注册页面
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    // 处理注册逻辑
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'USER', // 默认注册为普通用户
        ]);

        return redirect('/login')->with('success', '注册成功，请登录！');
    }

    // 显示登录页面
    public function showLoginForm()
    {
        return view('auth.login');
    }

    // 处理登录逻辑
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            // 检查用户角色并重定向
            if (Auth::user()->role === 'ADMIN') {
                return redirect()->intended('/admin/dashboard');
            }

            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => '提供的凭证不匹配我们的记录。',
        ])->onlyInput('email');
    }

    // 处理退出逻辑
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
