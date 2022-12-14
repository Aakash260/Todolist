const express = require('express');
const bodyParser = require('body-parser');
// const date=require(__dirname+"/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');
const app=express();
app.use(express.static("public"));
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));
async function main() {

    await mongoose.connect('mongodb+srv://akashnirwan26:skrschool26@database.w441exx.mongodb.net/Todolist');
}
const itemsSchema={
  name:String
}
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
  name:"Welcome to do list"
});
const item2=new Item({
  name:"Hit+ to add"
});
const item3=new Item({
  name:"Hit to delete an item"
});
const defaultItems=[item1,item2,item3];
const listSchema={
  name:String,
  items:[itemsSchema]
}
const List=mongoose.model("list",listSchema);
// Item.insertMany(defaultItems,function(err){
//   if(err){
//     console.log(err)
//   }else{
//     console.log("Successfully add")
//   }
// })
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}));
// const items=["BUy food","Cook food","Eat food"];
// const workitems=[];//u cant cange to entirely new but can add value its not protecting things inside
app.get("/",function(req,res){
// const day=date.getDate();

Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err)
        }else{
          console.log("Successfully add")
        }
      });
      res.redirect('/');
    }else{
    res.render("list",{listTitle:"Today",newitems:foundItems});
}
});
  // res.render("list",{listTitle:"Today",newitems:items});
});
app.post("/",function(req,res){
  console.log(req.body);
  let itemName=req.body.newitem;
  const listname=req.body.list;
  // if(req.body.list==="Work"){
  //     workitems.push(item);
  //     res.redirect("/work");
  // }else{
  //   items.push(item);
  //   res.redirect("/");
  // }
const item=new Item({
  name:itemName
});
if(listname==="Today"){
item.save();
res.redirect('/');
}else{
  List.findOne({name:listname},function(err,foundlist){
    foundlist.items.push(item);
    foundlist.save();
    res.redirect("/"+listname);
  })
}
});
// app.get("/work",function(req,res){
//   res.render("list",{listTitle:"Work list",newitems:workitems});
// })
app.get("/:customlist",function(req,res){
  // const customname=req.params.customlist;
  const customname=_.capitalize(req.params.customlist);
  List.findOne({name:customname},function(err,foundlist){
    if(!err){
      if(!foundlist){
        const list=new List({
          name:customname,
          items:defaultItems
        })
        list.save();
        res.redirect("/"+customname);
      }else{
      res.render("list",{listTitle:foundlist.name,newitems:foundlist.items})
      }
    }
  })

})
app.listen(3000,function(){
  console.log("server started")
});
// app.post("/work",function(req,res){
//   let item=req.body.newitem;
//   workitems.push(item)
//   res.redirect("/");
// })
app.post("/delete",function(req,res){
const checkid=req.body.checkbox;
const listname=req.body.listname;
if(listname==="Today"){
  Item.findByIdAndRemove(checkid,function(err){
    if(!err){
      console.log("Deleted!");
      res.redirect("/");
    }
  });
}
else{
  List.findOneAndUpdate({name:listname},{$pull:{items:{_id:req.body.checkbox}}},function(err,foundlist){
    if(!err){
      res.redirect("/"+listname);
    }
  })
}
});
