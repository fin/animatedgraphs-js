/** Transition Manager
 *
 * @name TransitionManager
 * @class
 */
function TransitionManager(raphael)
{
  var self = this;
  
  self.raphael = raphael;
  self.data;
  self.type = 'pie';
  self.dsid = 0;
  self.dlength = 1; //data levels count
  var a;

  /**
  * Draw with different parameters
  *
  * @memberOf TransitionManager#
  */ 
  self.draw = function(/** string */ type)
  {
      if(self.dlength==1) a.chart(type, [self.data.levels[0]]);
      else if(self.dlength==2) a.chart(type, [self.data.levels[0], self.data.levels[1]]);
  }
  
  /**
  * Draw with global parameters
  *
  * @memberOf TransitionManager#
  */  
  self.redraw = function()
  {
      if(self.dlength==1) a.chart(self.type, [self.data.levels[0]]);
      else if(self.dlength==2) a.chart(self.type, [self.data.levels[0], self.data.levels[1]]);
  }
  
   /**
  * Set graph type
  *
  * @memberOf TransitionManager#
  */
  self.setType = function(/** string */ t)
  {
    self.type = t;
    self.redraw();
  }
  
  /**
  * Set graph data
  *
  * @memberOf TransitionManager#
  */  
  self.setData = function(/** AG data format */ data)
  {
     self.data = data;    
     a = new AG(data.data, data.levels);
     self.dsid = 0;
     a.set_dataset(self.dsid);
     self.dlength = data.levels.length;
     
     
     self.redraw();
  }
  
  /**
  *  Change the value set in the dataset
  *
  * @memberOf TransitionManager#
  */   
  self.setDataValues = function(/** int */ id)
  {
      self.dsid = id;
      if(self.type=='pie')
      {
        self.draw('pie_separate');
        a.set_dataset(self.dsid);
        window.setTimeout(this.draw,3000, 'pie_separate');
        window.setTimeout(this.draw,5000, 'pie');
      }
      else if(self.type=='bar_grouped')
      {
        self.draw('bar_grouped');
        a.set_dataset(self.dsid);
        window.setTimeout(this.draw,3000, 'bar_grouped');
      }
      else if(self.type=='bar_stacked')
      {
        self.draw('bar_grouped');
        a.set_dataset(self.dsid);
        window.setTimeout(this.draw,3000, 'bar_grouped');
        window.setTimeout(this.draw,5000, 'bar_stacked');
      }
  }
}
