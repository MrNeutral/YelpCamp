/*jshint ignore:start*/
$( "document" ).ready(function(){
	let origOutput;
	if(document.getElementById("output")){
		origOutput = document.getElementById("output").innerHTML;
	}
	$(".submit").on("click", function(e) {
		if($(this).parent().prev().find("form").find("input").val() !== ""){
			updateData.call($(this).parent().prev().find("input"), e, true);
		}
	});
	$("#pills-tab a:first").tab("show");
	$("#back").prop("href", document.referrer);
	$("#searchForm").find("input").val("");
	$("#searchForm").on("input", async function(){
		const input = $(this).find("input");
		let output = document.getElementById("output");
		if(input.val() !== ""){
			const response = await fetch(`/campgrounds?search=${input.val()}`, {
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest"
				}
			});
			const data = await response.json();
			output.innerHTML = "";
			data.campgrounds.forEach(function(campground){
				output.innerHTML += `<div class="col-sm-12 col-md-3">
					<div class="card my-3 text-center">
						<img class="card-img-top" src="${campground.image}" class="img-fluid">
						<hr class="mx-auto">
						<div class="card-body ">
							<h4 class="card-title">${campground.name}</h4>
							<a class="card-text btn btn-sm btn-outline-info" href="/campgrounds/${campground._id}" class="btn btn-sm btn-primary">More Info</a>
						</div>
					</div>
				</div>`;
			});
		} else {
			output.innerHTML = origOutput;
		}
	});
	$(".edit-comment").find("input").on("keydown", function(e){
		updateData.call($(this), e, false);
	});
	
});
async function updateData(e, button){
	if(e.which == 13 || button){
		e.preventDefault();
		const input = $(this);
		input.closest(".modal.fade").modal("hide");
		const output = input.closest(".modal.fade").siblings("p") ;
		const commentData = input.closest(".edit-comment").serialize();
		if(input.val() !== ""){
			const response = await fetch(`${input.closest(".edit-comment").prop("action")}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"X-Requested-With": "XMLHttpRequest"
				},
				body: commentData
			});
			const data = await response.json();
			output.text(data.comment.body);
		}
	}
}
/*jshint ignore:end*/