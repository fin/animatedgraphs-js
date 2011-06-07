/*
 *
 * AnimatedGraphs:
 * datasets = array of objects, e.g. [{male: {asian: 1, african: 2}, female: {asian: 3, african: 2}}]
 * labels = labels for objects, e.g. ['gender', 'ethnicity']
 *
 */

function AG(datasets, labels) {
    var self = this;

    self.datasets = datasets;
    self.datasets_raw = [];
    self.labels = labels;

    self.dataset = null;
    self.dataset_raw = null;
    self.current_chart_type = null;
    self.current_elements = null;
    self.size_x = 400;
    self.size_y = 400;

    self.raphael = new Raphael();
    var raphael = self.raphael;
    var width = raphael.width;
    var height = raphael.height;


    self.chart_functions =  {
                    'bar': function(values) { return raphael.g.barchart_paths(0,0,width,height,values); },
                    'bar_grouped': function(values) { return raphael.g.barchart_paths(0,0,width,height,values, {barwidth: 40, gutter: '100%', to: 70, stretch: false}); },
                    'bar_stacked': function(values) { return raphael.g.barchart_paths(0,0,width,height,values, {stacked: true, barwidth: 40, gutter: '100%', to: 70, stretch: false}); },
                };


    /* 
     * switch dataset
     */
    self.set_dataset = function(id) {
        self.dataset = self.datasets[id];
        self.dataset_raw = self.datasets_raw[id];
    };

    /* 
     * annotate
     * prepend object keys in datasets with their respective labels
     * (for unique identification later on)
     */
    self.annotate_datasets = function() {
        for(var i=0;i<self.datasets.length;i++) {
            self.annotate_dataset(self.datasets[i]);
        }
    };
    self.annotate_dataset = function(dataset) {
        var annotate = function(input, level) {
            for(var k in input) {
                if(!input.hasOwnProperty(k))
                    continue;
                annotate(input[k], level+1);
                input[self.labels[level]+':'+k] = input[k];
                delete input[k];
            }
        };
        annotate(dataset, 0, {});
    };

    /*
     * summarize
     * basically denormalize datasets in this.datasets_raw
     * enables easier filtering and transformations later on
     */
    self.summarize_datasets = function() {
        for(var i=0;i<self.datasets.length;i++) {
            self.summarize_dataset(i);
        }
    };
    self.summarize_dataset = function(dataset_index) {
        var dataset = self.datasets[dataset_index];
        self.datasets_raw.push(self.summarize_dataset_recurse(dataset, [],0));
    };
    self.summarize_dataset_recurse = function(obj, current_key, depth) {
        var result = {};
        if(Raphael.is(obj, 'object')) {
            for(var key in obj) {
                if(!obj.hasOwnProperty(key))
                    continue;
                var val = obj[key];
                var ck = current_key.clone();
                ck[self.labels[depth]]=key;
                result = result.merge(self.summarize_dataset_recurse(val, ck, depth+1));
            }
            return result;
        } else {
            result[current_key.jsonproper()] = obj;
            return result;
        }
    };

    self.match_elements = function(key, labels, elements) {
        var matching_elements = [];
        for(var j=0;j<elements.length;j++) {
            var element = elements[j];
            var ekey = element.key;
            for(var k=0;k<labels.length;k++) {
                var label = labels[k];
                if(!ekey[label] || ekey[label] != key[label]) {
                    break;
                }
                if(k==(labels.length-1)) {
                    matching_elements.push(element);
                }
            }
        }
        return matching_elements;
    };

    /*
     * draw/change chart
     *
     * e.g.
     * chart('bar', ['gender']);
     * or
     * chart('bar-grouped', ['gender', 'ethnicity'])
     */
    self.chart = function(chart_type, labels) {
        var old_chart_type = self.current_chart_type;
        var old_elements = self.current_elements;
        self.current_elements = [];

        var data = self.get_data(labels);

        var chart_function = self.chart_functions[chart_type];

        var g = chart_function(data);
        var max_zindex=0;
        g.elements = flatten(g.elements);
        if(old_elements) {
            for(var i=0;i<g.elements.length;i++) {
                var element = g.elements[i];
                var matching_elements = self.match_elements(element.key, labels, old_elements);
                if(matching_elements.length>0) {
                    element.raphael_element = matching_elements[0].raphael_element;
                    var ndx = old_elements.indexOf(matching_elements[0]);
                    if(ndx>=0) {
                        old_elements.splice(ndx,1);
                    } else {}
                } else {
                    element.raphael_element = raphael.path(element.path);
                }
                element.raphael_element.animate({'path': element.path}, 1024);
                //element.raphael_element.attr(element.attr);
                self.current_elements.push(element);
                if(element.zindex && max_zindex<element.zindex)
                    max_zindex = element.zindex;
            }
            for(var i=0;i<old_elements.length;i++) {
                old_elements[i].raphael_element.remove();
            }
        } else {
            for(var i=0;i<g.elements.length;i++) {
                g.elements[i].raphael_element = raphael.path(g.elements[i].path);
                g.elements[i].raphael_element.attr(g.elements[i].attr);
                if(g.elements[i].zindex && max_zindex<g.elements[i].zindex) {
                    max_zindex = g.elements[i].zindex;
                }
                self.current_elements.push(g.elements[i]);
            }
            self.current_chart_type = chart_type;
        }
        for(var zi=max_zindex-1;zi>=0;zi--) {
            var es = self.current_elements.filter(function(x) {return x.zindex==zi;});
            for(var i=0;i<es.length;i++) {
                es[i].raphael_element.toFront();
            }
        }
    };



    /*
     * get_data
     * get data formatted for g.raphael-like input
     */
    self.get_data = function(labels) {
        var dataset = self.dataset_raw;
        var raw_values = [];
        var lbls = labels;

        var tmp = [];

        var label_values = [];

        for(var i=0;i<labels.length;i++) {
            var label = labels[i];
            label_values.push([]);
            for(var key in dataset) {
                if(!dataset.hasOwnProperty(key))
                    continue;
                var k = JSON.parse(key)[label];
                if(label_values[i].indexOf(k)<0) {
                    label_values[i].push(k);
                }
                raw_values.push({key: JSON.parse(key), value: dataset[key]});
            }
        }

        var recurse = function(values, index, labels, label_values) {
            var result = [];
            for(var i=0;i<label_values[index].length;i++) {
                var lv = label_values[index][i];
                var fv = values.filter(function(x) { return x.key[labels[index]]==lv;  });
                if(index+1<labels.length) {
                    fv = recurse(fv, index+1, labels, label_values);
                    result.push(fv);
                } else {
                    if(fv.length>0) {
                        var s = 0;
                        var k = {};
                        for(var j=0;j<fv.length;j++) {
                            s+=fv[j].value;
                        }
                        for(var j=0;j<labels.length;j++) {
                            var l = labels[j];
                            k[l] = fv[0].key[l];
                        }
                        result.push({key: k, value: s});
                    }
                }
            }
            return result;
        };
        return recurse(raw_values, 0, labels, label_values);
    };


    self.annotate_datasets();
    self.summarize_datasets();

    self.set_dataset(0);
}


//var ag = new AG({}, []);
//
//e.bind('click', ag.chart);
Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

Object.prototype.jsonproper = function() {
    var keys = [];
    for(var key in this) {
        if(!this.hasOwnProperty(key))
            continue;
        keys.push(key);
    }
    keys.sort();
    var result = {};
    for(var i=0;i<keys.length;i++) {
        result[keys[i]] = this[keys[i]];
    }
    return JSON.stringify(result);
};
Object.prototype.merge = (function (ob) {var o = this;var i = 0;for (var z in ob) {if (ob.hasOwnProperty(z)) {o[z] = ob[z];}}return o;})

function flatten(array){
    var flat = [];
    for (var i = 0, l = array.length; i < l; i++){
        var type = Object.prototype.toString.call(array[i]).split(' ').pop().split(']').shift().toLowerCase();
        if (type) { flat = flat.concat(/^(array|collection|arguments)$/.test(type) ? flatten(array[i]) : array[i]); }
    }
    return flat;
}
