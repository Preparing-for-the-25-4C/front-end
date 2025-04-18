export function extractJsonItems(jsonStr) {
    const parsedData = JSON.parse(jsonStr);
    const result = [];

    // 递归遍历所有层级的值
    function traverse(obj) {
        if (Array.isArray(obj)) {
            // 数组：遍历所有元素
            obj.forEach(item => traverse(item));
        } else if (typeof obj === 'object' && obj !== null) {
            // 对象：遍历所有属性值
            Object.values(obj).forEach(value => traverse(value));
        } else {
            // 基本类型：直接存入结果
            result.push(JSON.stringify(obj));
        }
    }

    traverse(parsedData);
    return result.join('\n');
}
const objectJson = '{ "说明": "你的任务是计算a+b。这是为了acm初学者专门设计的题目。你肯定发现还有其他题目跟这道题的标题类似，这些问题也都是专门为初学者提供的。", "输入格式": "输入包含一系列的a和b对，通过空格隔开。一对a和b占一行。", "输出格式": "对于输入的每对a和b，你需要依次输出a、b的和。\\n如对于输入中的第二对a和b，在输出中它们的和应该也在第二行。", "样例": { "输入": "1 5\\n10 20", "输出": "6\\n30" } }';
console.log(extractJsonItems(objectJson));
/* 输出：
{"key1":"value1"}
{"key2":"value2"}
*/