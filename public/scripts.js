/*jshint ignore:start*/
$("document").ready(function() {
	limitHeight();
	let origOutput;
	if ($(".alert.alert-success")) {
		setTimeout(() => $(".alert.alert-success").fadeOut(600, () => $(this).remove()), 2000);
	}
	if (document.getElementById("output")) {
		origOutput = document.getElementById("output").innerHTML;
	}
	$(".submit").on("click", function(e) {
		if (($(this).parent().prev().find("form").hasClass("edit-comment"))
			&& $(this).parent().prev().find("form").find("input").val() !== "") {
			updateComment.call($(this).parent().prev().find("input"), e, true);
		}
		else if ($(this).parent().prev().find("form").hasClass("edit-campground")) {
			updateCampground.call($(this).parent().prev().find("input"), e, true);
		}
		else if ($(this).parent().prev().find("form").hasClass("delete-campground")) {
			$(this).parent().prev().find("form").submit();
		}
		else if ($(this).parent().prev().find("form").hasClass("delete-comment")) {
			deleteComment.call($(this).parent().prev().find("form"));
		} else {
			$(this).parent().prev().find("form").submit();
		}
	});
	$("#pills-tab a:first").tab("show");
	$("#back").prop("href", document.referrer);
	$("#searchForm").find("input").val("");
	$("#searchForm").on("input", async function() {
		const input = $(this).find("input");
		let output = document.getElementById("output");
		if (input.val() !== "") {
			const response = await fetch(`/campgrounds?search=${input.val()}`, {
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest"
				}
			});
			const data = await response.json();
			output.innerHTML = "";
			data.campgrounds.forEach(function(campground) {
				output.innerHTML += `
				<div class="campground col-sm-12 col-md-4 col-lg-3">
					<div class="card border-primary text-white my-3 text-center">
						<img class="card-img-top" src="${campground.image}" class="img-fluid">
						<div class="card-body my-auto py-auto">
							<a class="h4" href="/campgrounds/${campground._id}" class="btn btn-sm btn-primary">${campground.name}</a>
						</div>
					</div>
				</div>
				`;
			});
		} else {
			output.innerHTML = origOutput;
		}
	});
	$(".edit-comment").find("input").on("keydown", function(e) {
		updateComment.call($(this), e, false);
	});
	$(".edit-campground").find("input").on("keydown", function(e) {
		updateCampground.call($(this).closest("form").find("input"), e, false);
	});
	$(".input-group-prepend button").on("click", function() {
		if ($(this).parent().siblings().hasClass("custom-file")) {
			$(this).closest("form").attr("enctype", "application/x-www-form-urlencoded");
			$(this).parent().siblings().html(`
					<input class="pl-3 form-control" type="url" name="campground[image]" placeholder="http://imgur.com/campground.jpg" required/>
			`);
			$(this).parent().siblings().removeClass("custom-file");
			$(this).parent().siblings().addClass("px-0");
		} else {
			$(this).closest("form").attr("enctype", "multipart/form-data");
			$(this).parent().siblings().html(`
				<input type="file" class="custom-file-input" id="inputGroupFile03" name="campground[image]" required>
				<label class="custom-file-label" for="inputGroupFile03">Choose file</label>
			`);
			$(this).parent().siblings().removeClass("px-0");
			$(this).parent().siblings().addClass("custom-file");
			$(this).parent().siblings().find("input").on("change", function() {
				//get the file name
				const fileName = $(this).val();
				//replace the "Choose a file" label
				$(this).next(".custom-file-label").html(fileName);
			});
		}
	});
	$("#inputGroupFile03").on("change", function() {
		//get the file name
		// eslint-disable-next-line no-useless-escape
		const fileName = $(this).val().replace(/^.*[\\\/]/, "");
		//replace the "Choose a file" label
		$(this).next(".custom-file-label").html(fileName);
	});
});
async function updateComment(e, button) {
	if (e.which == 13 || button) {
		e.preventDefault();
		const input = $(this);
		input.closest(".modal.fade").modal("hide");
		const output = input.closest(".modal.fade").siblings("p");
		const commentData = input.closest(".edit-comment").serialize();
		if (input.val() !== "") {
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

async function deleteComment() {
	const form = $(this);
	form.closest(".modal.fade").modal("hide");
	$("body").removeClass("modal-open");
	$(".modal-backdrop").remove();
	const response = await fetch(`${form.prop("action")}`, {
		"method": "DELETE",
		"headers": {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-Requested-With": "XMLHttpRequest"
		}
	});
	const data = await response.json();
	if (data.success) {
		if ($(".user")) {
			if ($(this).closest(".user").children().length == 1) {
				$(this).closest(".comment").remove();
				$(".user").html("<span>There's nothing here...</span>");
			} else {
				$(this).closest(".comment").remove();
			}
		}
	}
}

async function updateCampground(e, button) {
	if (e.which == 13 || button) {
		e.preventDefault();
		const inputs = $(this);
		inputs.closest(".modal.fade").modal("hide");
		let campgroundData = inputs.closest(".edit-campground").serialize();
		for (let i = 0, counter = 0; i < inputs.length; i++) {
			if (inputs[i].value != "" || i == inputs.length - 1) {
				counter++;
			}
			if (counter == inputs.length && i == inputs.length - 1) {
				const response = await fetch(`${inputs.closest(".edit-campground").prop("action")}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"X-Requested-With": "XMLHttpRequest"
					},
					body: campgroundData
				});
				const data = await response.json();
				$(".campground-image").attr("src", data.campground.image);
				$(".campground-price").text(data.campground.price);
				$(".campground-description").text(data.campground.description);
				$(".campground-name").text(data.campground.name);
			}
		}
	}
}

function limitHeight() {
	if ($(".comments").height() > $(".campground-show").height()) {
		$(".comments").height($(".campground-show").height());
		$(".comments").css("overflow-y", "scroll");
	} else {
		$(".comments").css("overflow-y", "hidden");
	}
}
/*jshint ignore:end*/
