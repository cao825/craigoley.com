/*! coTables 0.0.1
 * ©2015 CraigOley.com - MIT License
 */

/**
 * @summary     coTables
 * @description Sort, Filter, and Export HTML Tables
 * @version     0.0.1
 * @file        jquery.coTables.js
 * @author      Craig Oley (CraigOley.com)
 * @contact     CraigOley.com
 * @copyright   Copyright 2015 CraigOley.com
 *
 * This source file is free software, available under the following license:
 *   MIT license - https://tldrlegal.com/license/mit-license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: https://github.com/cao825/coTables
 */

(function ($) {
    $.fn.coTable = function (options) {
        ///// setup /////
        var coTable = $(this);
        var table_id = coTable.attr('id');
        var table_body = $("table#" + table_id + " tbody");
        var table_head = $("table#" + table_id + " thead");
        var normal_bg_color = rgb2hex($("table#" + table_id).css('background-color'));
        var stripe_bg_color = rgb2hex($("table#" + table_id + " tbody tr:first").css('background-color'));
        ///// default options /////
        var settings = $.extend({
            //allow column filtering
            filterable: true,
            filterCaseSensitive: true,
            //allow column sorting
            sortable: true,
            //allow export to excel
            exportable: true,
            //set custom xlsx file prefix
            exportFileName: "",
            //custom icon for export
            exportIcon: "",
            //show table info
            showTableInfo: true,
            //alternate row style
            alternateRows: true,
            //highlight hover row
            highlightHoverRow: true,
            imgPath: "/css/coTableImg/"
        }, options);

        if (!$("#coLoadWrapper").length) {
            $("body").append("<div class='coLoadWrapper'></div>");
        }

        if (!coTable.hasClass("coTable")) {
            if ((typeof table_id == "undefined") || (table_id === null) || (table_id === "")) {
                table_id = "coTable" + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                coTable.attr('id', table_id);
            }

            //validate image path ends in "/"
            if (settings.imgPath.slice(-1) !== "/") {
                settings.imgPath = settings.imgPath + "/";
            }
            var header_count = 0;
            var row_count = getRowCount();
            var header_info = new Array();

            ///// start main function /////
            coTable.addClass('coTable');

            //add sortable header items
            if (settings.sortable) {
                var sortable_html = "<div class='coSortHeaderBoth' style='float: right'>" +
                    "<img src='" + settings.imgPath + "sort_both.png' height='15' /></div>" +
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

            //add header filters
            if (settings.filterable) {
                var filter_row = "<tr class='coFilters coNoExport' id='" + table_id + "_coFilters'>";
                for (var i = 0; i < header_count; i++) {
                    var input_size = Math.round(header_info[i].width / 10);
                    filter_row = filter_row + "<th class='coFilter' id='" + table_id + "_coFilterCell_" + i + "'>" +
                        "<input size='" + input_size + "' class='coFilterInput form-control text-box single-line' " +
                        "name='coFilter_" + i + "' id='" + table_id + "_coFilter_" + i + "' type='text' />" +
                        "</th>";
                }
                filter_row = filter_row + "</tr>";
                table_head.append(filter_row);
            }

            //add exportable header items
            if (settings.exportable) {
                //have to enable table info, because that's where the export button will go
                settings.showTableInfo = true;
                if (settings.exportFileName != "") {
                    coTable.attr('coTableExportFileName', settings.exportFileName);
                }
            }

            //add table info header items
            if (settings.showTableInfo) {
                var info_html = "<tr class='coTableInfo' id='" + table_id + "_coTableInfo'>" +
                    "<th colspan='" + header_count + "' class='coNoExport'>";
                if (settings.exportable) {
                    var exportIcon;
                    if (settings.exportIcon != "") {
                        exportIcon = "<img src='" + settings.exportIcon + "' />";
                    } else {
                        exportIcon = "<i class='fa fa-file-excel-o'></i>";
                    }
                    info_html = info_html +
                        "<a href='javascript:void(0)' onclick='$(\"table#" + table_id + "\").coTableExport(" + JSON.stringify(options) + ");' class='coHoverImage'>" +
                        "</a>&ensp;";
                }
                info_html = info_html + "Row Count: " +
                    "<span id='" + table_id + "_coTableInfo_rowCount'>" + row_count + "</span>" +
                    "</th></tr>";
                table_head.append(info_html);
                setRowCount(getRowCount());
            }

            if (settings.highlightHoverRow) {
                $("table#" + table_id).addClass("table-hover");
            }
        }

        refresh(table_id);

        ///// end main function /////

        ///// start event functions /////
        /*
         * @description function to run when changing filter input data
         *      needs to be within a callable function for after sortable 
         *      table refresh
         */
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
                            var search_found;
                            if (settings.filterCaseSensitive) {
                                search_found = search_cell.text().search(search_text);
                            } else {
                                search_found = search_cell.text().toLowerCase().search(search_text.toLowerCase());
                            }
                            if ((search_text != "") &&
                                (!search_cell.hasClass('coFilter')) &&
                                (search_found === -1)) {
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
            refresh(table_id);
            return this;
        });

        $(".coSortHeader").click(function () {
            //Someone clicked a TH - let's do this thing.
            var my_elem = $(this);
            $(".coSortHeaderBoth").remove();
            coTable.find('th').each(function () {
                var my_th = $(this);
                //For every T/H that hasn't been clicked, reset the sortable image to show nothing sorted in that column.
                if (my_th.attr('id') != my_elem.attr('id')) {
                    my_th.find(".coSortHeaderBreak").before(
                        "<div class='coSortHeaderBoth' style='float:right'>" +
                        "<img src='" + settings.imgPath + "sort_both.png' height='15' /></div>");
                }
            });
            $("#" + table_id + "_coSortHeaderImg").remove();
            my_elem.find(".coSortContent").hide();

            my_elem.find(".coSortSpinner").show(function () {
                //Show the little arrows pointing the right way, set a class so we know which way it is sorted, and then do the sort
                if (my_elem.hasClass("coAscHeader")) {
                    $(".coSortHeader").removeClass("coAscHeader");
                    $(".coSortHeader").removeClass("coDescHeader");
                    my_elem.addClass("coDescHeader");
                    doSort(table_id, table_body, my_elem.index() + 1, "desc");
                    my_elem.find(".coSortHeaderBreak").before("<div id='" + table_id + "_coSortHeaderImg' style='float:right'>" +
                        "<img src='" + settings.imgPath + "sort_desc.png' height='15' /></div>");
                } else if (my_elem.hasClass("coDescHeader")) {
                    $(".coSortHeader").removeClass("coAscHeader");
                    $(".coSortHeader").removeClass("coDescHeader");
                    my_elem.addClass("coAscHeader");
                    doSort(table_id, table_body, my_elem.index() + 1, "asc");
                    my_elem.find(".coSortHeaderBreak").before("<div id='" + table_id + "_coSortHeaderImg' style='float:right'>" +
                        "<img src='" + settings.imgPath + "sort_asc.png' height='15' /></div>");
                } else {
                    $(".coSortHeader").removeClass("coAscHeader");
                    $(".coSortHeader").removeClass("coDescHeader");
                    my_elem.addClass("coAscHeader");
                    doSort(table_id, table_body, my_elem.index() + 1, "asc");
                    my_elem.find(".coSortHeaderBreak").before("<div id='" + table_id + "_coSortHeaderImg' style='float:right'>" +
                        "<img src='" + settings.imgPath + "sort_asc.png' height='15' /></div>");
                }

                //refresh the table so filters work as expected
                my_elem.find(".coSortSpinner").hide();
                my_elem.find(".coSortSpinner").addClass("coSortHidden");
                my_elem.find(".coSortContent").show();

            });
            return this;
        });

        ///// end event functions /////

        ///// start called functions /////

        function refresh(table_id) {
            if (settings.alternateRows) {
                setAltRows(table_id);
            }
        }

        //set alternate rows
        function setAltRows(table_id) {
            //Reapply alternate colors to table rows
            var table = $("table#" + table_id);
            if (!table.hasClass("table-striped")) {
                table.addClass("table-striped");
            } else {
                var count = 0;
                $("table#" + table_id + " tbody tr:visible").each(function () {
                    if (count % 2 === 1) {
                        $(this).css('background-color', normal_bg_color);
                    } else {
                        $(this).css('background-color', stripe_bg_color);
                    }
                    count++;
                });
            }
        }

        //Controller function for running the sort of a table with given ID, by given col
        function doSort(table_id, table_body, col, type) {
            var arr = new Array();
            //Build an array of all the data in that column
            $("table#" + table_id + " tbody tr td:nth-child(" + col + ")").each(function () {
                var this_elem = $(this);
                arr.push({ elem: this_elem, data: getSortData(this_elem.html()) });
            });
            //Perform a quick sort on the array of type (asc, desc)
            arr = quicksort(arr, type);

            var sorted_table;
            table_body.empty();
            for (var i = 0; i < arr.length; i++) {
                table_body.append(arr[i].elem.parent().clone());
            }
            refresh(table_id);
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
            if (settings.showTableInfo) {
                $("#" + table_id + "_coTableInfo_rowCount").html(row_count);
            }
        }

        function getRowCount() {
            var total_count = $("table#" + table_id + " tbody tr").length;
            var hidden_count = $("table#" + table_id + " tbody tr.coTableHidden").length;
            var count = total_count - hidden_count;
            return count;
        }

        function rgb2hex(rgb) {
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
             ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
             ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
             ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
        }

        return $(this);
    };


    $.fn.coTableExport = function (options) {
        var coTable = $(this);
        var id = coTable.attr('id');

        $('#coLoadWrapper').show("fast", function () {
            setTimeout(function () {
                var theTable = $("#" + id);
                var export_file_name = "";
                if (theTable.attr('coTableExportFileName')) {
                    export_file_name = theTable.attr('coTableExportFileName') + "_" + Date.now();
                } else {
                    export_file_name = "coTableExport_" + Date.now();
                }
                var oo = coGenerateArray(id);
                var ranges = oo[1];

                /* original data */
                var data = oo[0];

                var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

                /* add ranges to worksheet */
                ws['!merges'] = ranges;

                /* add worksheet to workbook */
                wb.SheetNames.push(export_file_name);
                wb.Sheets[export_file_name] = ws;

                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
                saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), export_file_name + ".xlsx");
                $("#coLoadWrapper").hide();
                return coTable;
            }, 1);
        });

        function coGenerateArray(table_id) {
            table_id = "#" + table_id;
            var header = new Array();
            var counter = 0;
            var ranges = [];
            var out = [];
            var outRow = [];
            //Gather excel headers from TH
            $("table" + table_id + " thead tr th").each(function () {
                var curr_cell = $(this);
                if (!(curr_cell.hasClass("coNoExport"))) {
                    var tr_counter = 0;
                    var td_counter = counter;
                    var rowspan = curr_cell.attr('rowspan');
                    var colspan = curr_cell.attr('colspan');
                    header[counter] = curr_cell.text().replace("Sorting...", "");
                    var cellValue = header[counter];
                    ranges.forEach(function (range) {
                        if (tr_count >= range.s.r && tr_count <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                            for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                        }
                    });

                    //Handle Row Span
                    if (rowspan || colspan) {
                        rowspan = rowspan || 1;
                        colspan = colspan || 1;
                        ranges.push({ s: { r: tr_count, c: outRow.length }, e: { r: tr_count + rowspan - 1, c: outRow.length + colspan - 1 } });
                    };

                    //Handle Value
                    outRow.push(cellValue !== "" ? cellValue : null);
                    counter++;
                }
            });
            out.push(outRow);
            var details = new Array();
            var tr_count = 0;
            var td_count = 0;
            var tbody = $(table_id + " tbody");
            var save_tbody_html = tbody.html();
            var regex = /<br\s*[\/]?>/gi;
            tbody.html(save_tbody_html.replace(regex, " ~EL~ "));

            //Loop through all rows that are visible (because of filtered tables)
            $(table_id + " tbody tr:visible").each(function () {
                var curr_row = $(this);
                outRow = [];
                if (!(curr_row.hasClass("coNoExport"))) {
                    details[tr_count] = new Array();
                    td_count = 0;
                    //Loop through all cells within the row and gather the text for export
                    curr_row.children("td").each(function () {
                        var curr_cell = $(this);
                        var rowspan = curr_cell.attr('rowspan');
                        var colspan = curr_cell.attr('colspan');
                        details[tr_count][td_count] = coGetText(curr_cell);
                        if (details[tr_count][td_count].replace(" ", "").replace(",", "") == parseFloat(details[tr_count][td_count].replace(" ", "").replace(",", ""))) {
                            details[tr_count][td_count] = details[tr_count][td_count].replace(" ", "").replace(",", "");
                        }
                        var cellValue = details[tr_count][td_count];

                        ranges.forEach(function (range) {
                            if (tr_count >= range.s.r && tr_count <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                                for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                            }
                        });

                        //Handle Row Span
                        if (rowspan || colspan) {
                            rowspan = rowspan || 1;
                            colspan = colspan || 1;
                            ranges.push({ s: { r: tr_count, c: outRow.length }, e: { r: tr_count + rowspan - 1, c: outRow.length + colspan - 1 } });
                        };

                        //Handle Value
                        outRow.push(cellValue !== "" ? cellValue : null);

                        //Handle Colspan
                        if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);

                        td_count++;
                    });
                    out.push(outRow);
                    tr_count++;
                }
            });

            tbody.html(save_tbody_html);
            var jsonData = new Object();
            jsonData.header = header;
            jsonData.details = details;
            var jsonString = JSON.stringify(jsonData);
            return [out, ranges];
        };

        function coDatenum(v, date1904) {
            if (date1904) v += 1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
        }

        function sheet_from_array_of_arrays(data, opts) {
            var ws = {};
            var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
            for (var R = 0; R != data.length; ++R) {
                for (var C = 0; C != data[R].length; ++C) {
                    if (range.s.r > R) range.s.r = R;
                    if (range.s.c > C) range.s.c = C;
                    if (range.e.r < R) range.e.r = R;
                    if (range.e.c < C) range.e.c = C;
                    var cell = { v: data[R][C] };
                    if (cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                    if (typeof cell.v === 'number') cell.t = 'n';
                    else if (typeof cell.v === 'boolean') cell.t = 'b';
                    else if (cell.v instanceof Date) {
                        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                        cell.v = coDatenum(cell.v);
                    }
                    else cell.t = 's';

                    ws[cell_ref] = cell;
                }
            }
            if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        }

        function Workbook() {
            if (!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        //recursive function to get the text we want from all elements of a TD for exporting a table
        function coGetText(elem) {
            var my_text = "";
            var tag = elem.get(0).tagName;
            switch (tag) {
                case "INPUT":
                    //.text on input fields doesn't work, we need .val
                    if (elem.attr('type') === "checkbox") {
                        if (elem.attr('checked'))
                            return " " + elem.val();
                        else
                            return "";
                    } else {
                        return " " + elem.val();
                    }
                    break;
                case "SELECT":
                    //we only want the text of the selected option from the drop down - not all options
                    return " " + elem.children(":selected").text();
                    break;
                case "TEXTAREA":
                    return " " + elem.val();
                    break;
                case "IMG":
                    //If there is an image with an alt tag, let's throw that in the export, too
                    return elem.attr('alt');
                    break;
                case "A":
                    //We don't need link text in the spreadsheet - that's just silly.
                    return "";
                    break;
                default:
                    var kids = elem.children(":visible");
                    //elem is not a special tag, so let's just grab the text
                    if (kids.length > 0) {
                        //Oh wait, it's got some kids - just get their text instead.
                        //If you do a .text on the whole thing and then their children (which may be special tags) - things aren't very pretty
                        kids.each(function () {
                            var child_elem = $(this);
                            //I only want to get the text of the kids I can see.  
                            //If they are hidden from the page, don't put them in the spreadsheet!
                            if (child_elem.is("br")) {
                                my_text = my_text + " ~EL~ ";
                            }
                            else if (child_elem.is(":visible")) {
                                my_text = my_text + " " + coGetText(child_elem);
                            }
                        });
                        return " " + my_text;
                    } else {
                        //Okay, this is just a random tag with no kids - give me the text.
                        //Replace any line breaks with new lines to make it look a little better in excel
                        return " " + elem.text();
                    }
            }
        }
    };
}(jQuery));

if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    }
}