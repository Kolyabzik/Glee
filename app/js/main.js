$(function () {
	$('.intro__slider').slick({
		arrows: false,
		dots: true
	})

	$('.filter__btn--products').on('click', function () {
		$('.filter__btn--products').removeClass('_active');
		$(this).addClass('_active');
	})

	$('.filter__btn--category').on('click', function () {
		$('.filter__btn--category').removeClass('_active');
		$(this).addClass('_active');
	})



	let mixer = mixitup('.products__items');
})