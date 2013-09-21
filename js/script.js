//отчет
//постановка задачи
//описание метода эйлера
//описание работы программы со скриншотом
//заключение
//листинг


$(document).ready(function(){

    var window = $("#window"),
        undo = $("#undo")
            .bind("click", function() {
                var data = Pog();
                DrawGraphic4(data);

                var data2 = Locpog();
                DrawGraphic5(data2);
                window.data("kendoWindow").open().center();

                undo.hide();
            });

    var onClose = function() {
        undo.show();
    }

    if (!window.data("kendoWindow")) {

        window.kendoWindow({
            width: "1300px",
            height: "580px",
            title: "Графики погрешностей",
            close: onClose
        });
    }

    function Locpog(){
        var data = [];
        var y0=1;
        var y=1;
        var w=1;
        var h= 0;
        var loceulera, loclomannyh, lockoshieulera;

        for (k=0; k<51; k++)
        {
            i=k*0.1;


            //var a = k*0.05;
            loceulera = Math.abs(y-y0);

            data.push({ x: i, loceulera: loceulera });

            h = 0.1;
            h2 = 0.05;

            y0=y0+h*(2*y0); // метод эйлера
            y =y+h2*(2*y);  // метод эйлера с половинным делением
        }
        return data;
    }

    function Pog(){
        var data = [];
        var y0=1;
        var y=1;
        var w=1;
        var h= 0;
        var abseulera, abslomannyh, abskoshieulera;

        for (k=0; k<51; k++)
        {
            i=k*0.1;

            var n = i+h/2;

            var loman = y+(2*y)*h/2;

            y = y+h*(2*loman);

            w = w+((2*w)+(2*w)+h*(2*w))*h/2;
            //var a = k*0.05;
            abseulera = Math.abs(Math.exp(2*i)-y0);
            abslomannyh = Math.abs(Math.exp(2*i)-y);
            abskoshieulera = Math.abs(Math.exp(2*i) - w);

            data.push({ x: i, abseulera: abseulera, abslomannyh: abslomannyh, abskoshieulera:abskoshieulera});

            h = 0.1;

            y0=y0+0.1*(2*y0);
        }
        return data;
    }

    function EulerMetod(){
        var data = [];
        y0=1;
        var h= 0;
        var z;
        var x;
        for (k=0; k<51; k++)
        {
            i=k*0.1;
            var n = i+h/2;


            //var a = k*0.05;
            data.push({ x: i, y: y0+h*(2*y0), z: Math.exp(2*i) });
            h = 0.1;

            y0=y0+0.1*(2*y0);



        }
        return data;
    }

    function MetodLomannyh(){
        var data = [];
        var y0=1;
        var h= 0;
        var z;
        for (k=0; k<51; k++)
        {
            i=k*0.1;
            var n = i+h/2;
            var loman = y0+(2*y0)*h/2;
            y0 = y0+h*(2*loman);
            //var a = k*0.05;
            data.push({ x: i, l: y0, z: Math.exp(2*i)});
            h = 0.1;

        }
        return data;
    }

    function MetodKoshiEulera(){
        var data = [];
        var y=1;
        var h= 0;
        var z;
        var x=0;
        for (k=0; k<51; k++)
        {
             x=x+h;

            y = y+((2*y)+(2*y)+h*(2*y))*h/2;
            //var n = i+h/2;
            //var a = k*0.05;
            data.push({ x: x, w: y, z: Math.exp(2*x)});

            h = 0.1;

        }
        return data;
    }

    function DrawGraphic(data){
        $("#grid").kendoGrid({
            dataSource: {
                data: data,
                pageSize:51,
                width: "100px"
            },
            selectable: "multiple",
            groupable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true
            },
            columns: [ {
                field: "x",
                width: 25,
                title: "Значение по X"
            } , {
                field: "y",
                width: 50,
                title: "Решение методом Эйлера"
            }, {
                field: "z",
                width: 50,
                title: "Точное решение"
            }
            ]
        });

        function getFilter(xMin, xMax) {
            return [{
                field: "x",
                operator: "gt",
                value: xMin
            }, {
                field: "x",
                operator: "lt",
                value: xMax
            }]
        }

        function createChart() {
            $("#chart").kendoChart({

                chartArea: {
                    background: "white",
                    border:{
                        color: "red"
                    }
                },

                dataSource: {
                    data: data,
                    filter: getFilter(-10, 10)
                },

                xAxis: {
                    name: "xAxis",
                    min: -10,
                    max: 10,
                    labels: {
                        format: "{0:N1}"
                    }
                },

                title:{
                    text: "Построение графика"},

                tooltip: {
                    visible: true

                },
                legend: {
                    position: "bottom"
                },

                series: [


                    {
                        name:"Точное решение",
                        type: "scatterLine",
                        xField: "x",
                        yField: "z",
                        dashType: "dot", // вид ломаных прямых, точки или пунктиры
                        labels:{align: "column"},

                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }},

                    {
                        name: "Метод Эйлера",
                        type: "scatterLine",
                        xField: "x",
                        yField: "y",

                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }
                    }
                ],
                transitions: true,
                drag: setRange,
                zoom: setRange

            });

            function setRange(e) {
                var chart = e.sender;
                var ds = chart.dataSource;
                var options = chart.options;


                e.originalEvent.preventDefault();

                var xRange = e.axisRanges.xAxis;
                if (xRange) {

                    var xMin = xRange.min;
                    var xMax = xRange.max;


                    if (xMax - xMin < 2) {
                        return;
                    }


                    options.xAxis.min = xMin;
                    options.xAxis.max = xMax;


                    ds.filter(getFilter(xMin, xMax));
                }
            }
        }
        createChart();
        $("#example").bind("kendo:skinChange", createChart);
        e.preventDefault();
    }

    function DrawGraphic2(data){
        $("#grid2").kendoGrid({
            dataSource: {
                data: data,
                pageSize:51
            },
            selectable: "multiple",
            groupable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true
            },
            columns: [ {
                field: "x",
                width: 25,
                title: "Значение по X"
            },  {
                field: "l",
                width: 50,
                title: "Ус. метод ломанных"
            },
                {
                    field: "z",
                    width: 50,
                    title: "Точное решение"
                }
            ]
        });

        function getFilter(xMin, xMax) {
            return [{
                field: "x",
                operator: "gt",
                value: xMin
            }, {
                field: "x",
                operator: "lt",
                value: xMax
            }]
        }

        function createChart() {
            $("#chart2").kendoChart({

                chartArea: {
                    background: "white",
                    border:{
                        color: "red"
                    }
                },

                dataSource: {
                    data: data,
                    filter: getFilter(-10, 10)
                },

                xAxis: {
                    name: "xAxis",
                    min: -10,
                    max: 10,
                    labels: {
                        format: "{0:N1}"
                    }
                },

                title:{
                    text: "Построение графика"},

                tooltip: {
                    visible: true

                },
                legend: {
                    position: "bottom"
                },

                series: [


                    {
                        name:"Точное решение",
                        type: "scatterLine",
                        xField: "x",
                        yField: "z",

                        dashType: "dot", // вид ломаных прямых, точки или пунктиры
                        labels:{align: "column"},

                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }},
                    {
                        name: "Метод ломаных",
                        type: "scatterLine",
                        xField: "x",
                        yField: "l",
                        color: "red",

                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }
                    }

                ],
                transitions: true,
                drag: setRange,
                zoom: setRange

            });

            function setRange(e) {
                var chart = e.sender;
                var ds = chart.dataSource;
                var options = chart.options;


                e.originalEvent.preventDefault();

                var xRange = e.axisRanges.xAxis;
                if (xRange) {

                    var xMin = xRange.min;
                    var xMax = xRange.max;


                    if (xMax - xMin < 2) {
                        return;
                    }


                    options.xAxis.min = xMin;
                    options.xAxis.max = xMax;


                    ds.filter(getFilter(xMin, xMax));
                }
            }
        }
        createChart();
        $("#example").bind("kendo:skinChange", createChart);
        e.preventDefault();
    }

    function DrawGraphic3(data){
        $("#grid3").kendoGrid({
            dataSource: {
                data: data,
                pageSize:51
            },
            selectable: "multiple",
            groupable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true
            },
            columns: [ {
                field: "x",
                width: 25,
                title: "Значение по X"
            },  {
                field: "w",
                width: 50,
                title: "Метод Коши-Эйлера"
            },
            {
                    field: "z",
                    width: 50,
                    title: "Точное решение"
            }
            ]
        });

        function getFilter(xMin, xMax) {
            return [{
                field: "x",
                operator: "gt",
                value: xMin
            }, {
                field: "x",
                operator: "lt",
                value: xMax
            }]
        }

        function createChart() {

            $("#chart3").kendoChart({

                chartArea: {
                    background: "white",
                    border:{
                        color: "blue"
                    }
                },

                dataSource: {
                    data: data,
                    filter: getFilter(-10, 10)
                },

                xAxis: {
                    name: "xAxis",
                    min: -10,
                    max: 10,
                    labels: {
                        format: "{0:N1}"
                    }
                },

                title:{
                    text: "Построение графика"},

                tooltip: {
                    visible: true

                },
                legend: {
                    position: "bottom"
                },

                series: [

                    {
                        name:"Точное решение",
                        type: "scatterLine",
                        xField: "x",
                        yField: "z",
                        dashType: "dot", // вид ломаных прямых, точки или пунктиры
                        labels:{align: "column"},

                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }},
                     {
                        name: "Метод Коши-Эйлера",
                        type: "scatterLine",
                        xField: "x",
                        yField: "w",
                        color: "blueviolet",

                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }
                    }

                ],
                transitions: true,
                drag: setRange,
                zoom: setRange

            });

            function setRange(e) {
                var chart = e.sender;
                var ds = chart.dataSource;
                var options = chart.options;


                e.originalEvent.preventDefault();

                var xRange = e.axisRanges.xAxis;
                if (xRange) {

                    var xMin = xRange.min;
                    var xMax = xRange.max;


                    if (xMax - xMin < 2) {
                        return;
                    }


                    options.xAxis.min = xMin;
                    options.xAxis.max = xMax;


                    ds.filter(getFilter(xMin, xMax));
                }
            }
        }
        createChart();

        $("#example").bind("kendo:skinChange", createChart);
        e.preventDefault();
    }

    function DrawGraphic4(data){
        $("#grid4").kendoGrid({
            dataSource: {
                data: data,
                pageSize:51
            },
            selectable: "multiple",
            groupable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true
            },
            columns: [ {
                field: "x",
                width: 25,
                title: "Значение по X"
            } , {
                field: "abseulera",
                width: 50,
                title: "метод эйлера"
            }, {
                field: "abslomannyh",
                width: 50,
                title: "Ус. метод ломанных"
            },
            {
                    field: "abskoshieulera",
                    width: 50,
                    title: "Метод Коши-Эйлера"
            }
            ]
        });

        function getFilter(xMin, xMax) {
            return [{
                field: "x",
                operator: "gt",
                value: xMin
            }, {
                field: "x",
                operator: "lt",
                value: xMax
            }]
        }

        function createChart() {
            $("#chart4").kendoChart({

                chartArea: {
                    background: "white",
                    border:{
                        color: "red"
                    }
                },

                dataSource: {
                    data: data,
                    filter: getFilter(-10, 10)
                },

                xAxis: {
                    name: "xAxis",
                    min: -10,
                    max: 10,
                    labels: {
                        format: "{0:N1}"
                    }
                },

                title:{
                    text: "Абсолютная погрешность"},

                tooltip: {
                    visible: true

                },
                legend: {
                    position: "bottom"
                },

                series: [


                    {
                        name:"Метод Эйлера",
                        type: "scatterLine",
                        xField: "x",
                        yField: "abseulera",
                        color: "red",
                        dashType: "dot", // вид ломаных прямых, точки или пунктиры
                        labels:{align: "column"},

                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }},

                    {
                        name: "Ус. метод ломанных",
                        type: "scatterLine",
                        xField: "x",
                        yField: "abslomannyh",
                        color: "green",

                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }
                    },

                    {
                        name: "Метод Коши-Эйлера",
                        type: "scatterLine",
                        xField: "x",
                        yField: "abskoshieulera",
                        color: "blue",
                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }
                    }
                ],
                transitions: true,
                drag: setRange,
                zoom: setRange

            });

            function setRange(e) {
                var chart = e.sender;
                var ds = chart.dataSource;
                var options = chart.options;


                e.originalEvent.preventDefault();

                var xRange = e.axisRanges.xAxis;
                if (xRange) {

                    var xMin = xRange.min;
                    var xMax = xRange.max;


                    if (xMax - xMin < 2) {
                        return;
                    }


                    options.xAxis.min = xMin;
                    options.xAxis.max = xMax;


                    ds.filter(getFilter(xMin, xMax));
                }
            }
        }
        createChart();
        $("#example").bind("kendo:skinChange", createChart);

    }

    function DrawGraphic5(data){
        $("#grid5").kendoGrid({
            dataSource: {
                data: data,
                pageSize:51
            },
            selectable: "multiple",
            groupable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true
            },
            columns: [ {
                field: "x",
                width: 25,
                title: "Значение по X"
            } , {
                field: "loceulera",
                width: 50,
                title: "метод эйлера"
            }
            ]
        });

        function getFilter(xMin, xMax) {
            return [{
                field: "x",
                operator: "gt",
                value: xMin
            }, {
                field: "x",
                operator: "lt",
                value: xMax
            }]
        }

        function createChart() {
            $("#chart5").kendoChart({

                chartArea: {
                    background: "white",
                    border:{
                        color: "red"
                    }
                },

                dataSource: {
                    data: data,
                    filter: getFilter(-10, 10)
                },

                xAxis: {
                    name: "xAxis",
                    min: -10,
                    max: 10,
                    labels: {
                        format: "{0:N1}"
                    }
                },

                title:{
                    text: "Локальная погрешность"},

                tooltip: {
                    visible: true

                },
                legend: {
                    position: "bottom"
                },

                series: [


                    {
                        name:"Метод Эйлера",
                        type: "scatterLine",
                        xField: "x",
                        yField: "loceulera",
                        color: "red",
                        dashType: "dot", // вид ломаных прямых, точки или пунктиры
                        labels:{align: "column"},

                        markers: {
                            visible: true,
                            template: " #= category #  #= value # #= dataSource.data # #= value #"
                        }}
                ],
                transitions: true,
                drag: setRange,
                zoom: setRange

            });

            function setRange(e) {
                var chart = e.sender;
                var ds = chart.dataSource;
                var options = chart.options;


                e.originalEvent.preventDefault();

                var xRange = e.axisRanges.xAxis;
                if (xRange) {

                    var xMin = xRange.min;
                    var xMax = xRange.max;


                    if (xMax - xMin < 2) {
                        return;
                    }


                    options.xAxis.min = xMin;
                    options.xAxis.max = xMax;


                    ds.filter(getFilter(xMin, xMax));
                }
            }
        }
        createChart();
        $("#example").bind("kendo:skinChange", createChart);

    }

    $("#buttongo").click(function(e){
       $(".jumbotron").hide("slow");
       $("#menu").show("slow");
       $("button").popover('show');
    });

    $("#button").click(function(e){
        $("#chart").show("slow");
        $("#grid").show("slow");
        $("#first").show("slow");
        $("button").popover('hide');
        data = EulerMetod();
          DrawGraphic(data);

        });

    $("#button2").click(function(e){
        $("#chart2").show("slow");
        $("#grid2").show("slow");
        $("#second").show("slow");
        data = MetodLomannyh();
        DrawGraphic2(data);

    });

    $("#button3").click(function(e){
        $("#chart3").show('slow');
        $("#grid3").show("slow");
        $("#third").show("slow");
        data = MetodKoshiEulera();
        DrawGraphic3(data);
    });

    $("#button").dblclick(function(e){
        $("#chart").hide("slow");
        $("#grid").hide("slow");
    })

    $("#button2").dblclick(function(e){
        $("#chart2").hide("slow");
        $("#grid2").hide("slow");
    })

    $("#button3").dblclick(function(e){
      $("#chart3").hide("slow");
        $("#grid3").hide("slow");
    })
});

