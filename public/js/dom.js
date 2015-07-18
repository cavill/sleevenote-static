var container = $(".albums"),
h = window.height,
n = $(".navbar").outerHeight();

$(container).css("min-height",h-n);

console.log(h,n,h-n);