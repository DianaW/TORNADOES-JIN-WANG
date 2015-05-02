var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var space = 0;
var DateString = null;
var previousString = null;
var StateString = null;

var project = d3.geo.albersUsa()
    .translate([width/2+160,height/2-100])
    .scale(900);

var path=d3.geo.path()
    .projection(project);

//var locationData = d3.map();

var scaleColor = d3.scale.ordinal().domain(["0","1","2","3","4","5"])
    .range(['blue','red','purple','orange','yellow','green']);

queue()
    .defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.json, "data/gz_2010_us_050_00_5m.json")
    .defer(d3.csv, "data/tornado-2011-v2.csv")
    .defer(d3.csv, "data/tornado-1999-v2.csv")
    //.defer(d3.csv,"data/the numbers and states.csv",parseNew)
    .await(function(err,states,counties,data2011,data1999){
        //console.log(states.features);
        //console.log(data1999)
        var parsedData1 = data2011.map(function(d){
            return {
                cDate: d['Date'],
                EF: +d['EF#(Fujita rating)'],
                states: d['State'],
                cLocation: d['Location'],
                Counties: d['County'],
                clngLat: [+d.longitude,+d.latitude],
                Time:+d['Time'],
                CPM:+d['Path  Length Distance Miles'],
                CPKM:+d['Path  Length Distance KM'],
                TD:+d['totaldate'],
                TS:+d['totalstates']
            }
        })

        var parsedData2 = data1999.map(function(d){
            return {
                cDate: d['Date'],
                EF: +d['EF#(Fujita rating)'],
                states: d['State'],
                cLocation: d['Location'],
                Counties: d['County'],
                clngLat: [+d.longitude,+d.latitude],
                Time:+d['Time'],
                CPM:+d['Path  Length Distance Miles'],
                CPKM:+d['Path  Length Distance KM'],
                TD:+d['totaldate'],
                TS:+d['totalstates']
            }
        })
        //console.log(data1);
        console.log(parsedData1);
        console.log(parsedData2)
        $('.year').on('click',function(e) {
            e.preventDefault();
            //console.log($(this).data('year'));
            var year =$(this).data('year');
            if(year ==2011){
                draw(parsedData1);
            }
            if(year==1999){
                draw(parsedData2);
            }
        })
        drawCountry(counties,states);
        draw(parsedData1);
    });

function draw(data){
    var previousString1 = [null];

    var updateCir=svg.selectAll('.location')
        .data(data);
    var enterCir= updateCir.enter();
    var exitCir=updateCir.exit();

    updateCir
        .attr('cx',function(d){return project(d.clngLat)[0]})
        .attr('cy',function(d){return project(d.clngLat)[1]})
        .attr('r',3)
        .style('fill',function(d){return scaleColor(d.EF)})
    enterCir
        .append('circle')
        .attr('class','location')
        .attr('cx',function(d){return project(d.clngLat)[0]})
        .attr('cy',function(d){return project(d.clngLat)[1]})
        .attr('r',3)
        .style('fill',function(d){return scaleColor(d.EF)})

    exitCir.remove();
    svg.selectAll("circle")

        .on("mouseover",function(d){
            var tx=parseFloat(d3.select(this).attr("cx"));
            var ty=parseFloat(d3.select(this).attr("cy"));

            var tips=svg.append("g")
                .attr("id","tips");

            var tipRect=tips.append("rect")
                .attr("x",tx+10)
                .attr("y",ty+10)
                .attr("width",250)
                .attr("height",20)
                .attr("fill","#FFF")
                .attr("stroke-width",1)
                .attr("stroke","#CCC")

            DateString = d.cDate

            StateString = d.states;

            var tipText=tips.append("text")
                .attr("class","tiptools")
                .text('Date:'+' '+d.cDate)
                //.attr('text-anchor','middle')
                .attr("x",tx+15)
                .attr("y",ty+25);
            var tipRect2=tips.append("rect")
                .attr("x",tx+10)
                .attr("y",ty+30)
                .attr("width",250)
                .attr("height",20)
                .attr("fill","#FFF")
                .attr("stroke-width",1)
                .attr("stroke","#CCC");

            var tipText2=tips.append("text")
                .attr("class","tiptools")
                .text('EF:'+"  "+d.EF)
                //.attr('text-anchor','middle')
                .attr("x",tx+15)
                .attr("y",ty+45);
            var tipRect3=tips.append("rect")
                .attr("x",tx+10)
                .attr("y",ty+50)
                .attr("width",250)
                .attr("height",20)
                .attr("fill","#FFF")
                .attr("stroke-width",1)
                .attr("stroke","#CCC");

            var tipText3=tips.append("text")
                .attr("class","tiptools")
                .text('State:'+"  "+d.states)
                //.attr('text-anchor','middle')
                .attr("x",tx+15)
                .attr("y",ty+65);
            var tipRect4=tips.append("rect")
                .attr("x",tx+10)
                .attr("y",ty+70)
                .attr("width",250)
                .attr("height",20)
                .attr("fill","#FFF")
                .attr("stroke-width",1)
                .attr("stroke","#CCC");

            var tipText4=tips.append("text")
                .attr("class","tiptools")
                .text('County:'+'  '+ d.Counties)
                //.attr('text-anchor','middle')
                .attr("x",tx+15)
                .attr("y",ty+85);
            var tipRect5=tips.append("rect")
                .attr("x",tx+10)
                .attr("y",ty+90)
                .attr("width",250)
                .attr("height",20)
                .attr("fill","#FFF")
                .attr("stroke-width",1)
                .attr("stroke","#CCC");

            var tipText5=tips.append("text")
                .attr("class","tiptools")
                .text('Location:'+'  '+ d.cLocation)
                //.attr('text-anchor','middle')
                .attr("x",tx+15)
                .attr("y",ty+105);
            var tipRect6=tips.append("rect")
                .attr("x",tx+10)
                .attr("y",ty+110)
                .attr("width",250)
                .attr("height",20)
                .attr("fill","#FFF")
                .attr("stroke-width",1)
                .attr("stroke","#CCC");

            var tipText6=tips.append("text")
                .attr("class","tiptools")
                .text('Path  Length Distance (M):'+"  "+d.CPM)
                //.attr('text-anchor','middle')
                .attr("x",tx+15)
                .attr("y",ty+125);
            var tipRect7=tips.append("rect")
                .attr("x",tx+10)
                .attr("y",ty+130)
                .attr("width",250)
                .attr("height",20)
                .attr("fill","#FFF")
                .attr("stroke-width",1)
                .attr("stroke","#CCC");

            var tipText7=tips.append("text")
                .attr("class","tiptools")
                .text('Path  Length Distance (KM):'+"  "+d.CPKM)
                //.attr('text-anchor','middle')
                .attr("x",tx+15)
                .attr("y",ty+145);

            RectRec
                .style("fill",function(d)
                {
                    if(DateString == d.cDate)
                    {
                        console.log(DateString);
                        return "lightskyblue";
                    }
                    else
                    {
                        return "NavajoWhite";
                    }
                })


            RectRec2
                .style("fill",function(d)
                {
                    if(StateString == d.states)
                    {
                        console.log(StateString);
                        return "lightskyblue";
                    }
                    else
                    {
                        return "pink";
                    }
                })


        })
        .on("mouseout",function(d){
            d3.select("#tips").remove();

            //FIRST
            DateString = null;
            RectRec
                .style("fill",function(d) {
                    return "NavajoWhite";
                })

            //SECOND
            DateString1 = null;
            RectRec2
                .style("fill",function(d) {
                    return "pink";
                })


        });

    //FIRST
    svg.selectAll("rect").data([]).exit().remove();
    var Rect = svg.selectAll("rect")
        .data(data)
        .enter()

    //Rect
    //    .data([]).exit().remove();
    var RectRec = Rect
        .append('rect')
        .attr('class','rect')
        .attr('x',0)
        .attr('y',function(d,i){

            if(d.TD == 0)
            {
                space = space + 1;
            }

            return 30*(i-space);
        })
        .attr('width',function(d){return 6*d.TD})
        .attr('height',10)
        .style("fill",function(d) {
            return "NavajoWhite";
        })

    space = 0;

    svg.selectAll("text").data([]).exit().remove();
    var RectText = Rect
        .append('text')
        .text(function(d,i){
            if(d.TS!=null)
            {
                if((previousString==null)||(previousString!= d.cDate)) {
                    previousString = d.cDate;
                    return 'Date:' + '  ' + d.cDate+' '+'('+ d.TD+')';
                }
            }
        })
        .attr('x',0)
        .attr('y',function(d,i){

            if(d.TD == 0)
            {
                space = space + 1;
            }
            return 30*(i-space)-2;
        })

        .style('font-size',8)

    space = 0;


    //SECOND
    svg.selectAll("rect1").data([]).exit().remove();
    var RectRec2 = Rect
        .append('rect')
        .attr('class','rect')
        .attr('x',220)
        .attr('y',function(d,i){

            if(d.TS == 0)
            {
                space = space + 1;
            }

            return 30*(i-space);
        })
        .attr('width',function(d){return 6*d.TS})
        .attr('height',10)
        .style("fill",function(d) {
            return "pink";
        })

    space = 0;

    svg.selectAll("text1").data([]).exit().remove();
    var RectText2= Rect
        .append('text')
        .text(function(d,i){
            if(d.TS!=0)
            {
                for(var j=0;j<previousString1.length;j++)
                {
                    if(previousString1[j]== d.states)
                    {
                        break;
                    }
                    else
                    {
                        if(j==previousString1.length-1)
                        {
                            console.log(previousString1);
                            previousString1.push(d.states);
                            return 'State:' + '  ' + d.states+' '+'('+ d.TS+')';
                        }
                    }
                }
            }
        })
        .attr('x',220)
        .attr('y',function(d,i){

            if(d.TS == 0)
            {
                space = space + 1;
            }
            return 30*(i-space)-2;
        })
        .style('font-size',8)

    space = 0;


    var KeyText = svg.selectAll('.key')
        .data(data)
        .enter()
        .append('text')
        .text(function(d){return 'EF'+''+d.EF;})
        .attr("x",function(d){return 60*d.EF+395})
        .attr("y",33)
        .style('font-size',10);

    var updateKeyText = svg.selectAll('.key')
        .data(data)
        .enter()
        .append('text')
        .text('EF = Fujita rating')
        .attr("x",395)
        .attr("y",5)
        //.style('stroke',)
        .style('font-size',10);
    /*var KeyText = svg.selectAll('.key')
     .data(data)
     .enter()
     .append('text')
     .text('729')
     .attr("x",394)
     .attr("y",10)
     //.style('stroke',)
     .style('font-size',12);
     var KeyText = svg.selectAll('.key')
     .data(data)
     .enter()
     .append('text')
     .text('729')
     .attr("x",394)
     .attr("y",10)
     //.style('stroke',)
     .style('font-size',12);
     var KeyText = svg.selectAll('.key')
     .data(data)
     .enter()
     .append('text')
     .text('628')
     .attr("x",453)
     .attr("y",10)
     //.style('stroke',)
     .style('font-size',12);
     var KeyText = svg.selectAll('.key')
     .data(data)
     .enter()
     .append('text')
     .text('197')
     .attr("x",514)
     .attr("y",10)
     //.style('stroke',)
     .style('font-size',12);
     var KeyText = svg.selectAll('.key')
     .data(data)
     .enter()
     .append('text')
     .text('61')
     .attr("x",577)
     .attr("y",10)
     //.style('stroke',)
     .style('font-size',12);*/


    var  CirclePoint = svg.selectAll('.key')
        .data(data)
        .enter()
        .append('circle')
        .attr('class','keys')
        .attr('cx',function(d){return 60*d.EF+403.5})
        .attr('cy',18)
        .attr('r',3)
        //.style('stroke','2px')
        .style('fill',function(d){return scaleColor(d.EF)})



}

function drawCountry(country,states){

    svg.append('path')
        .attr('class','state')
        .attr('d',path(states))
}

function parse(d){
    var parsedRow = {
        cDate: +d['Date'],
        EF: +d['EF#(Fujita rating)'],
        states: d['State'],
        cLocation: d['Location'],
        Counties: d['County'],
        clngLat: d['latitude'],
        Time:+d['Time'],
        CPM:+d['Path  Length Distance Miles'],
        CPKM:+d['Path  Length Distance KM'],
        TD:+d['totaldate'],
        TS:+d['totalstates']
    };

    if( parsedRow.clngLat && parsedRow.Time && parsedRow.CPM &&parseRow.CPKM && parseRow.TD &&parseRow.TS){
        return parsedRow;
    }
    else{
        return;
    }

}
