console.log("Assignment 3");

//Set up drawing environment with margin conventions
var margin = {t:20,r:20,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.l - margin.r,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width + margin.l + margin.r)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plot-area')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Initialize axes
//Consult documentation here https://github.com/mbostock/d3/wiki/SVG-Axes


var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(-height);

var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width)
    .tickValues([0,25,50,75,100]);


//Start importing data

    //Eliminate records for which gdp per capita isn't available

    //Check "primary completion" and "urban population" columns
    //if figure is unavailable and denoted as "..", replace it with undefined
    //otherwise, parse the figure into numbersd3.csv('/data/world_bank_2012.csv', parse, dataLoaded);

d3.csv ('/data/world_bank_2012.csv', parse, dataLoaded);
function parse(d){
    if(d['GDP per capita, PPP (constant 2011 international $)']=='..'){
        return;    
    }
  
    return{
    cName: d['Country Name'],
    cCode: d['Country Code'],
    gdpPerCap: +d['GDP per capita, PPP (constant 2011 international $)'],
    primaryCompletion: d['Primary completion rate, total (% of relevant age group)']!='..'?+d['Primary completion rate, total (% of relevant age group)']:undefined,
    urbanPop: d['Urban population (% of total)']!='..'?+d['Urban population (% of total)']:undefined
    };
    
}



function dataLoaded(error, rows) {
    //with data loaded, we can now mine the data
    var gdpPerCapMin = d3.min(rows, function (d) {
            return d.gdpPerCap
        }),
        gdpPerCapMax = d3.max(rows, function (d) {
            return d.gdpPerCap
        });


    //with mined information, we can now set up the scales
    var scaleX = d3.scale.log().domain([gdpPerCapMin, gdpPerCapMax]).range([0, width]),//design preference
        scaleY = d3.scale.linear().domain([0, 100]).range([height, 0]);

    axisX.scale(scaleX);
    axisY.scale(scaleY);
//Draw axisX and axisY

    plot.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(axisX);

    plot.append('g')
        .attr('class', 'axis axis-y')
        .call(axisY);


    var countries = plot.selectAll('g')
        .data(rows)
        .enter()
        .append('g')
        .attr('class','country')

    countries.append('line')
        .attr('x1', function (d) {
            return scaleX(d.gdpPerCap)
        })
        .attr('y1',height)
        .attr('x2', function (d){
            return scaleX(d.gdpPerCap)
        })
        .attr('y2',function(d){
            return scaleY(d.primaryCompletion)
        })
        .style('stroke','red')


    countries.append('line')
        .attr('x1',function(d){
            return scaleX(d.gdpPerCap)
        })
        .attr('y1',height)
        .attr('x2',function (d){
            return scaleX(d.gdpPerCap)
        })
        .attr('y2',function (d){
            return scaleY(d.urbanPop)
        })
        .style('stroke','blue')




//each country should have two <line> elements, nested under a common <g> element
// draw <line> elements to represent countries

}

