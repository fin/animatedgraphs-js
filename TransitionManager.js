// Transition Manager

function TransitionManager(raphael)
{
  var self = this;
  
  self.raphael = raphael;
  self.data;
  self.type = 'pie';
  self.dsid = 0;
  var a;

  /*
  * Draw with different parameters
  */ 
  self.draw = function(type, datalevels)
  {
      a.chart(type, datalevels);
  }
  
  /*
  * Draw with global parameters
  */  
  self.redraw = function()
  {
      a.chart(self.type, [self.data.levels[0]]);
  }
  
   /*
  * Set graph type
  */
  self.setType = function(type)
  {
    self.type = type;
    redraw();
  }
  
  /*
  * Set graph data
  */  
  self.setData = function(data)
  {
     self.data = data;    
     a = new AG(data.data, data.levels);
     a.set_dataset(self.dsid);
     //a.chart('pie', [data.levels[0]]);
     self.redraw();
  }
  
  /*
  *  Change the value set in the dataset
  */   
  self.setDataValues = function(id)
  {
      self.dsid = id;
      if(self.type=='pie')
      {
        a.chart('pie_separate', [data.levels[0]]);
        a.set_dataset(self.dsid);
        window.setTimeout(this.draw,2000, 'pie_separate',[data.levels[0]]);
        window.setTimeout(this.draw,4000, 'pie',[data.levels[0]]);
      }
  }
}
