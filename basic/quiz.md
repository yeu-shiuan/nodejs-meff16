(1) 請問下列程式執行後的結果為何？為什麼？
//start
//IIFE
//end
//Timeout
//回呼函式由上而下執行，但 Timeout 會延遲 1 秒。

console.log("start");

(function () {
console.log("IIFE");
setTimeout(function () {
console.log("Timeout");
}, 1000);
})();

console.log("end");

(2) 請問下列程式執行的結果為何？為什麼？
//start
//IIFE
//end
//Timeout
//回呼函式，setTimeout 被丟到 webapis,全部內容做完，由 event loop 判斷有沒有要執行的函式，再由 task queue 執行。

console.log("start");

(function () {
console.log("IIFE");
setTimeout(function () {
console.log("Timeout");
}, 0);
})();

console.log("end");

(3) 請問下列程式執行的結果為何？為什麼？
//foo
//bar
//baz
//回呼函式立即執行 foo()後，才會依序順序由上而下執行其他 function。

const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
console.log("foo");
bar();
baz();
};

foo();

(4) 請問下列程式執行的結果為何？為什麼？
//foo
//baz
//bar
//回呼函式執行 foo()後才開始執行其他 function，又因為 single-thread 及 FIFO 的關係，才先執行 baz()再 bar()。

const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
console.log("foo");
setTimeout(bar, 0);
baz();
};

foo();
