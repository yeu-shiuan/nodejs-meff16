function sum(n, cb) {
    let result = 0;
    for (let i = 1;i <= n; i++) {
        result += i;
    }
    //回呼
    cb(result);
}

function reportAns(ans) {
    console.log(`Hi,答案是 ${ans}`);
}
function reportAns2(ans) {
    console.log(`Hi,答案是 ${ans}`);
}
sum(10,reportAns2);