(function ($) {
    $.fn.coTable = function (options) {
        ///// setup /////
        var coTable = this;
        var table_id = coTable.attr('id');
        var table_body = $("table#" + table_id + " tbody");
        var table_head = $("table#" + table_id + " thead");
        if ((typeof table_id == "undefined") || (table_id === null) || (table_id === "")) {
            table_id = "coTable" + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            coTable.attr('id', table_id);
        }
        ///// default options /////
        var settings = $.extend({
            //allow column filtering
            filterable: true,
            filter_case_sensitive: true,
            //allow column sorting
            sortable: true,
            //allow export to excel
            exportable: true,
            //show table info
            show_table_info: true,
            img_path: "/Content/css/coTableImg/",
            filter_debug: false
        }, options);
        if (settings.img_path.slice(-1) !== "/") {
            settings.img_path = settings.img_path + "/";
        }
        var header_count = 0;
        var row_count = getRowCount();
        var header_info = new Array();

        ///// start main function /////
        coTable.addClass('coTable');
        if(settings.sortable) {
            var sortable_html = "<div class='coSortHeaderBoth' style='float: right'>" + 
                "<img src='" + settings.img_path + "sort_both.png' height='15' /></div>" +
                "<br class='coSortHeaderBreak' /><div class='coClear'></div>" +
                "<div class='coSortSpinner coSortHidden'>Sorting...</div>";
        }

        coTable.find('th').each(function () {
            var this_th = $(this);
            if (!this_th.hasClass('coSortHeader') && (settings.sortable)) {
                this_th.addClass('coSortHeader');
                this_th.html("<div class='coSortWrapper'>" +
                    "<div class='coSortContent'>" + this_th.html() + "&emsp;</div>" +
                    sortable_html + "</div>");
            }
            var this_th_id = this_th.attr('id');
            if ((typeof curr_id == "undefined") || (curr_id === null) || (curr_id === "")) {
                this_th_id = 'coTable' + header_count;
                this_th.attr('id', this_th_id);
            }
            header_info.push({
                id: this_th_id,
                width: this_th.width()
            });
            header_count++;
        });

        if (settings.filterable) {
            var filter_row = "<tr class='coFilters' id='" + table_id + "_coFilters'>";
            for (var i = 0; i < header_count; i++) {
                var input_size = Math.round(header_info[i].width / 10);
                filter_row = filter_row + "<td class='coFilter' id='" + table_id + "_coFilterCell_" + i + "'>" +
                    "<input size='" + input_size + "' class='coFilterInput form-control text-box single-line' " +
                    "name='coFilter_" + i + "' id='" + table_id + "_coFilter_" + i + "' type='text' />" +
                    "</td>";
            }
            filter_row = filter_row + "</tr>";
            table_body.prepend(filter_row);
        }

        if (settings.show_table_info) {
            var info_html = "<tr class='coTableInfo' id='" + table_id + "_coTableInfo'>" +
                "<th colspan='" + header_count + "'>" +
                "Row Count: " +
                "<span id='" + table_id + "_coTableInfo_rowCount'>" + row_count + "</span>" +
                "</th></tr>";
            table_head.append(info_html);
            setRowCount(getRowCount());
        }

        refresh();

        ///// end main function /////

        ///// start event functions /////
        function filterable() {
            $(".coFilterInput").keyup(function (event) {
                $(this).closest('table')
                    .find('tr')
                    .each(function () {
                        $(this).removeClass('coTableToHide')
                            .addClass('coTableToShow');
                    });
                $(".coFilterInput").each(function () {
                    var this_filter = $(this);
                    if (this_filter.val()) {
                        var this_cell = this_filter.parent();
                        var columnNum = this_cell.index() + 1;
                        var search_text = this_filter.val();
                        this_cell.closest('table')
                            .find('td:nth-child(' + columnNum + ')')
                            .each(function () {
                                var search_cell = $(this);
                                var curr_row = search_cell.parent();
                                if ((search_text != "") &&
                                    (!search_cell.hasClass('coFilter')) &&
                                    (search_cell.text().search(search_text) === -1)) {
                                    curr_row.addClass('coTableToHide')
                                        .removeClass('coTableToShow');
                                }
                            });
                    }
                    return this;
                });
                $(".coTableToHide").each(function () {
                    var this_row = $(this);
                    this_row.addClass('coTableHidden')
                        .removeClass('coTableToHide')
                        .removeClass('coTableToShow');
                    return this;
                });
                $(".coTableToShow").each(function () {
                    $(this).removeClass('coTableHidden')
                        .removeClass('coTableToShow');
                    return this;
                });
                setRowCount(getRowCount());
                return this;
            });
        }

        $(".coSortHeader").click(function () {
            //Someone clicked a TH - let's do this thing.
            var my_elem = $(this);
            $(".coSortHeaderBoth").remove();
            coTable.find('th').each(function () {
                var my_th = $(this);
                //For every TH that hasn't been clicked, reset the sortable image to show nothing sorted in that column.
                if (my_th.attr('id') != my_elem.attr('id')) {
                    my_th.find(".coSortHeaderBreak").before(
                        "<div class='coSortHeaderBoth' style='float:right'>" +
                        "<img src='" + settings.img_path + "sort_both.png' height='15' /></div>");
                }
            });
            $("#" + table_id + "_coSortHeaderImg").remove();
            my_elem.find(".coSortContent").hide();
            __coDebug__ShowAllFilters("clickFunction pre-sort");
            my_elem.find(".coSortSpinner").show(function () {
                //Show the little arrows pointing the right way, set a class so we know which way it is sorted, and then do the sort
                if (my_elem.hasClass("coAscHeader")) {
                    $(".coSortHeader").removeClass("coAscHeader");
                    $(".coSortHeader").removeClass("coDescHeader");
                    my_elem.addClass("coDescHeader");
                    doSort(table_id, table_body, my_elem.index() + 1, "desc");
                    my_elem.find(".coSortHeaderBreak").before("<div id='" + table_id + "_coSortHeaderImg' style='float:right'>" +
                        "<img src='" + settings.img_path + "sort_desc.png' height='15' /></div>");
                } else if (my_elem.hasClass("coDescHeader")) {
                    $(".coSortHeader").removeClass("coAscHeader");
                    $(".coSortHeader").removeClass("coDescHeader");
                    my_elem.addClass("coAscHeader");
                    doSort(table_id, table_body, my_elem.index() + 1, "asc");
                    my_elem.find(".coSortHeaderBreak").before("<div id='" + table_id + "_coSortHeaderImg' style='float:right'>" +
                        "<img src='" + settings.img_path + "sort_asc.png' height='15' /></div>");
                } else {
                    $(".coSortHeader").removeClass("coAscHeader");
                    $(".coSortHeader").removeClass("coDescHeader");
                    my_elem.addClass("coAscHeader");
                    doSort(table_id, table_body, my_elem.index() + 1, "asc");
                    my_elem.find(".coSortHeaderBreak").before("<div id='" + table_id + "_coSortHeaderImg' style='float:right'>" +
                        "<img src='" + settings.img_path + "sort_asc.png' height='15' /></div>");
                }
                __coDebug__ShowAllFilters("clickFunction post-sort");
                //refresh the table so filters work as expected
                my_elem.find(".coSortSpinner").hide();
                my_elem.find(".coSortSpinner").addClass("coSortHidden");
                my_elem.find(".coSortContent").show();

            });
            return this;
        });

        ///// end event functions /////

        ///// start called functions /////

        function refresh() {
            filterable();
        }

        //Controller function for running the sort of a table with given ID, by given col
        function doSort(table_id, table_body, col, type) {
            __coDebug__ShowAllFilters("doSort start");
            var arr = new Array();
            //Build an array of all the data in that column
            $("table#" + table_id + " tbody tr td:nth-child(" + col + ")").each(function () {
                var this_elem = $(this);
                if (!this_elem.hasClass('coFilter')) {
                    arr.push({ elem: this_elem, data: getSortData(this_elem.html()) });
                }
            });
            __coDebug__ShowAllFilters("doSort Array Created");
            //Perform a quick sort on the array of type (asc, desc)
            arr = quicksort(arr, type);
            if (settings.filterable) {
                var filters = $("table#" + table_id + " tbody tr.coFilters").clone();
            }
            var sorted_table = "";
            for (var i = 0; i < arr.length; i++) {
                var attr_list = "";
                //Reset all the attributes of the given TR we are moving around
                if (typeof arr[i].elem.parent().attr("onclick") !== "undefined")
                    attr_list = attr_list + " onclick='" + arr[i].elem.parent().attr("onclick") + "'";
                if (typeof arr[i].elem.parent().attr("id") !== "undefined")
                    attr_list = attr_list + " id='" + arr[i].elem.parent().attr("id") + "'";
                if (typeof arr[i].elem.parent().attr("style") !== "undefined")
                    attr_list = attr_list + " style='" + arr[i].elem.parent().attr("style") + "'";
                if (typeof arr[i].elem.parent().attr("class") !== "undefined")
                    attr_list = attr_list + " class='" + arr[i].elem.parent().attr("class") + "'";

                sorted_table = sorted_table +
                    "<tr" + attr_list + ">" +
                    $(arr[i].elem.parent()).html() +
                    "</tr>";
            }
            //Apply the new sorted table into the tbody wrapper of the old table
            table_body.html(sorted_table);
            if (settings.filterable) {
                filters.prependTo(table_body);
            }
            refresh();
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

        function setRowCount(count) {
            row_count = count;
            if (settings.show_table_info) {
                $("#" + table_id + "_coTableInfo_rowCount").html(row_count);
            }
        }

        function getRowCount() {
            var total_count = $("table#" + table_id + " tbody tr").length;
            var hidden_count = $("table#" + table_id + " tbody tr.coTableHidden").length;
            var count = total_count - hidden_count;
            console.log("Row Count: " + total_count + " - " + hidden_count + " = " + count);
            if (settings.filterable) {
                count--;
            }
            return count;
        }

        ////////// DEBUG FUNCTIONS ///////////

        function __coDebug__ShowAllFilters(section) {
            if (settings.filter_debug) {
                console.log(section);
                $(".coFilterInput").each(function () {
                    var elem = $(this);
                    console.log(elem.attr('id') + ": " + elem.val());
                });
            }
            return this;
        }

        return this;
    };
}(jQuery));