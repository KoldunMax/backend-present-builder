

var getProfit = function (){

var data = [1000 , 1005 , 990 , 1001] 

var maxPrice = data.max();
var minPrice = data.min();
console.log("max" , maxPrice);


};



Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

getProfit();
