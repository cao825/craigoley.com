(function ($) {
    $.fn.coTable = function (options) {
        var coTable = this;
        var table_id = coTable.attr('id');
        if ((typeof table_id === undefined) || (table_id === null) || (table_id === "")) {
            table_id = "coTable" + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            coTable.attr('id', table_id);
        }
        //default options
        var settings = $.extend({
            //allow column filtering
            filterable: true,
            //allow column sorting
            sortable: true,
            //allow export to excel
            exportable: true,
            img_path: "/Content/css/coTableImg/"
        }, options);
        if (settings.img_path.slice(-1) !== "/") {
            settings.img_path = settings.img_path + "/";
        }
        var header_count = 0;

        coTable.addClass('coTable');
        if(settings.sortable) {
            var sortable_html = "<div class='sortHeaderBoth' style='float:right'>" + 
                "<img src='" + settings.img_path + "sort_both.png' height='15' /></div>" +
                "<div class='sortSpinner' style='float:right; display:none'>Sorting...</div>";
        }

        coTable.find('th').each(function () {
            var this_th = $(this);
            if (!this_th.hasClass('sortHeader') && (settings.sortable)) {
                this_th.addClass('sortHeader');
                this_th.html(this_th.html() + sortable_html);
            }
            this_th.attr('id', 'coTable' + header_count);
            header_count++;
        });

        $(".sortHeader").click(function () {
            //Someone clicked a TH - let's do this thing.
            var my_elem = $(this);
            $(".sortHeaderBoth").remove();
            coTable.find('th').each(function () {
                var my_th = $(this);
                //For every TH that hasn't been clicked, reset the sortable image to show nothing sorted in that column.
                if (my_th.attr('id') != my_elem.attr('id')) {
                    my_th.html(my_th.html() + 
                        "<div class='sortHeaderBoth' style='float:right'>" +
                        "<img src='" + settings.img_path + "sort_both.png' height='15' /></div>");
                }
            });
            $("#sortHeaderImg").remove();
            my_elem.find(".sortSpinner").show(function () {
                //Show the little arrows pointing the right way, set a class so we know which way it is sorted, and then do the sort
                if (my_elem.hasClass("ascHeader")) {
                    $(".sortHeader").removeClass("ascHeader");
                    $(".sortHeader").removeClass("descHeader");
                    my_elem.addClass("descHeader");
                    doSort(table_id, my_elem.index() + 1, "desc");
                    my_elem.html(my_elem.html() + "<div id='sortHeaderImg' style='float:right'>" +
                        "<img src='" + settings.img_path + "sort_desc.png' height='15' /></div>");
                } else if (my_elem.hasClass("descHeader")) {
                    $(".sortHeader").removeClass("ascHeader");
                    $(".sortHeader").removeClass("descHeader");
                    my_elem.addClass("ascHeader");
                    doSort(table_id, my_elem.index() + 1, "asc");
                    my_elem.html(my_elem.html() + "<div id='sortHeaderImg' style='float:right'>" +
                        "<img src='" + settings.img_path + "sort_asc.png' height='15' /></div>");
                } else {
                    $(".sortHeader").removeClass("ascHeader");
                    $(".sortHeader").removeClass("descHeader");
                    my_elem.addClass("ascHeader");
                    doSort(table_id, my_elem.index() + 1, "asc");
                    my_elem.html(my_elem.html() + "<div id='sortHeaderImg' style='float:right'>" +
                        "<img src='" + settings.img_path + "sort_asc.png' height='15' /></div>");
                }
                //refresh the table so filters work as expected
                my_elem.find(".sortSpinner").hide();
            });
        });

        //Controller function for running the sort of a table with given ID, by given col
        function doSort(table_id, col, type) {
            var arr = new Array();
            //Build an array of all the data in that column
            $("table#" + table_id + " tbody tr td:nth-child(" + col + ")").each(function () {
                var this_elem = $(this);
                arr.push({ elem: this_elem, data: getSortData(this_elem.html()) });
            });
            //Perform a quick sort on the array of type (asc, desc)
            arr = quicksort(arr, type);
            var sorted_table = "";
            for (var i = 0; i < arr.length; i++) {
                var attr_list = "";
                //Reset all the attributes of the given TR we are moving around
                if (arr[i].elem.parent().attr("onclick") !== "undefined")
                    attr_list = attr_list + " onclick='" + arr[i].elem.parent().attr("onclick") + "'";
                if (arr[i].elem.parent().attr("id") !== "undefined")
                    attr_list = attr_list + " id='" + arr[i].elem.parent().attr("id") + "'";
                if ((arr[i].elem.parent().attr("style") !== "undefined"))
                    attr_list = attr_list + " style='" + arr[i].elem.parent().attr("style") + "'";
                if (arr[i].elem.parent().attr("class") !== "undefined")
                    attr_list = attr_list + " class='" + arr[i].elem.parent().attr("class") + "'";

                sorted_table = sorted_table +
                        "<tr" + attr_list + ">" +
                        $(arr[i].elem.parent()).html() +
                        "</tr>";
            }
            //Apply the new sorted table into the tbody wrapper of the old table
            $("table#" + table_id + " tbody").html(sorted_table);
            /*
            if ($("table" + table_id).hasClass("alternate")) {
                //Reapply alternate colors to table rows
                $("table" + table_id + " tr").removeClass("even");
                $("table" + table_id + " tr").removeClass("odd");
                $(".alternate tr:nth-child(even)").addClass("even");
                $(".alternate tr:nth-child(odd)").addClass("odd");
            }*/
        }

        function getSortData(my_str) {
            if (my_str.replace(" ", "") == parseInt(my_str.replace(" ", ""))) {
                return parseInt(my_str.replace(" ", ""));
            } else if (my_str.replace(" ", "").replace(",", "") == parseFloat(my_str.replace(" ", "").replace(",", ""))) {
                return parseFloat(my_str.replace(" ", "").replace(",", ""));
            } else {
                return my_str.toLowerCase();
            }
        }

        //Recursive quicksort function of array with asc/desc type
        function quicksort(arr, type) {
            if (arr.length === 0)
                return [];

            var left = new Array();
            var right = new Array();
            var pivot = arr[0];

            for (var i = 1; i < arr.length; i++) {
                if (type === "asc") {
                    if (arr[i].data < pivot.data) {
                        left.push(arr[i]);
                    } else {
                        right.push(arr[i]);
                    }
                } else {
                    if (arr[i].data > pivot.data) {
                        left.push(arr[i]);
                    } else {
                        right.push(arr[i]);
                    }
                }
            }

            return quicksort(left, type).concat(pivot, quicksort(right, type));
        }

        return this;
    };
}(jQuery));