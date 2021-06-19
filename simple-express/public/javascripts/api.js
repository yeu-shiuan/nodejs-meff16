//ajax
$(function(){
     $.ajax({
			method: "GET",
			url: "/api/stocks",				

	}).done(function (data) {
			console.log(data);
			});
		})

//axios
axios.get("/api/stocks").then((res) => {
    console.log(res.data);
})
    .catch(function (error) {
    console.log(error);
})

//fetch
fetch("/api/stocks")
.then((tes)=>{
    return tes.json();
})
.then((data)=>{
    console.log(data);
})