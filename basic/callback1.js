let doWork = function (job, timer, cb) {
    setTimeout(() => {
      let dt = new Date();
      cb(null, `完成工作: ${job} at ${dt.toISOString()}`);
    }, timer);
  };
  
  let dt = new Date();
  console.log(`開始工作 at ${dt.toISOString()}`);
  doWork("刷牙", 2000, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(result);

    doWork("吃早餐", 3000, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(result);
    doWork("寫功課", 5000, function (err, result) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(result);
  });
  });
});

// function doWork(){
//     setTimeout(function(){
//         console.log("刷牙");
//         setTimeout(function(){
//             console.log("吃早餐");
//             setTimeout(function(){
//                 console.log("寫作業")
//             })
//         })
//     })
//   }