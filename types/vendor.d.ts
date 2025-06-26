/*
 * ==========================================================
 * 新文件: types/vendor.d.ts
 * ==========================================================
 * 这个文件的作用是为那些没有提供官方 TypeScript 类型定义的第三方库
 * (如 'upyun', 'webdav', 'cos-nodejs-sdk-v5') 提供一个基础的模块声明。
 * 这会告诉 TypeScript：“请信任这些模块，不要因为找不到它们的‘说明书’而报错。”
 * 这能一次性解决所有 "Could not find a declaration file for module" 类型的编译错误。
 */
declare module 'upyun';
declare module 'webdav';
declare module 'cos-nodejs-sdk-v5';
