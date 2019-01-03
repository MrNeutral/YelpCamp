$(".submit").on("click", function() {
	if($(this).parent().prev().find("form").find("input").val() !== ""){
		$(this).parent().prev().find("form").submit();
	}
});
$("#pills-tab a:first").tab("show");
/*jshint ignore:start*/
$( "document" ).ready($("#searchForm").find("input").val(""));
$("#searchForm").on("input", async function(e){
	const input = $(this).find("input");
	const response = await fetch(`/campgrounds?search=${input.val()}`, {
		headers: {
			"Content-Type": "application/json",
			"X-Requested-With": "XMLHttpRequest"
		}
	});
	const data = await response.json();
	let output = document.getElementById("output");
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
});
/*jshint ignore:end*/
