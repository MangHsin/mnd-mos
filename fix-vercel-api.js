const fs = require('fs');
const path = require('path');

console.log('🔍 Vercel API 配置诊断工具');
console.log('========================');

// 检查项目结构
console.log('\n1. 检查项目结构...');
const apiDir = path.join(__dirname, 'api');
if (fs.existsSync(apiDir)) {
  console.log('✅ api/ 目录存在');
  const apiFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.js'));
  console.log(`✅ 找到 ${apiFiles.length} 个API文件:`, apiFiles);
} else {
  console.log('❌ api/ 目录不存在');
}

// 检查vercel.json
console.log('\n2. 检查vercel.json...');
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  console.log('✅ vercel.json 存在');
  const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  console.log('📋 当前配置:', JSON.stringify(config, null, 2));
} else {
  console.log('❌ vercel.json 不存在');
}

// 检查package.json
console.log('\n3. 检查package.json...');
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json 存在');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('📦 项目名称:', pkg.name);
  console.log('📦 构建脚本:', pkg.scripts.build);
} else {
  console.log('❌ package.json 不存在');
}

// 检查API文件格式
console.log('\n4. 检查API文件格式...');
const helloPath = path.join(__dirname, 'api', 'hello.js');
if (fs.existsSync(helloPath)) {
  const content = fs.readFileSync(helloPath, 'utf8');
  if (content.includes('module.exports')) {
    console.log('✅ api/hello.js 格式正确');
  } else {
    console.log('❌ api/hello.js 格式不正确');
  }
} else {
  console.log('❌ api/hello.js 不存在');
}

console.log('\n5. 建议的解决方案...');
console.log('📝 如果API仍然404，请尝试以下步骤：');
console.log('   1. 删除 .vercel 目录: rm -rf .vercel');
console.log('   2. 重新部署: vercel');
console.log('   3. 检查日志: vercel logs');
console.log('   4. 本地测试: vercel dev');

console.log('\n🎯 测试命令：');
console.log('   curl https://your-project.vercel.app/api/hello');
console.log('   curl https://your-project.vercel.app/api/test-api'); 