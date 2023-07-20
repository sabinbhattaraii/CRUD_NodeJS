import { HttpStatus } from "../constant/constant.js";
import successResponseData from "../helper/successResponseData.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
//note sorting, filtering and pagination data are passed from query data
//and query data always comes in string though it is boolean or data or number ...
// find({})//mens show all object
// select("")//means select all field
// sort("")//means no sorting
// limit("")//means no limit (thar why it show all data)
// skip("")//means no skip
let sortingFun = (_sort = "") => {
  // sort according to field
  //***cases to be handled */
  //no _sort is passed
  //?_sort=""
  //?_sort=email//in place of email you can write any field
  //?_sort=-email
  //?_sort=-email,firstName//in place of email, firsName you can write any field
  //?_sort=dob //means sort  according to date(works normally)
  //?_sort=isMarried //means sort  according to boolean (works normally first false then true)
  //?_sort=phoneNumber //means sort  according to number //not unlike js number sort work properly
  //?_sort=otherField //here other field
  let sort = "";
  if (_sort) {
    let _sortArr = _sort.split(",");
    sort = _sortArr.join(" ");
  } else {
    //let sort by default according to createdAt
    sort = "-createdAt";
  }
  return sort;
  // for sorting basic
  // .sort("")//means no sorting
  // .sort("email")//means sort according to email and in ascending
  // .sort("-email")//means sort according to email and in descending
  // .sort("email -firstName")//means sort first according to email and then sort(for similar) according to firstName in descending
  // .sort("ram")//here ram is field which is not is schema in this case it try to perform sorting according to ram but , since ram is not a field so it does not do any thing (same as sort(""))
};
let getExactPageData = (_brake, _page, _showAllData) => {
  //we know limit and skip required number so we have to convert them in number
  //and giving default value for limit and  page
  let limit = "";
  let skip = "";
  if (_showAllData !== "true") {
    //setting default value
    _brake = Number(_brake) || 10;
    _page = Number(_page) || 1;
    limit = `${_brake}`;
    skip = `${(_page - 1) * _brake}`;
    //***cases to be handled */
    //no _brake or no page is passed
    //?_brake=&_page=
    //?_brake=3&_page=5//
    //?_brake=0&_page=0//there is not page 0 ( and this kind of case is handle by default value)
    //?__showAllData=true//there is not page 0 ( and this kind of case is handle by default value)
  } else {
    limit = "";
    skip = "";
    //limit "" means show all document
    //skip "" means dont skip
  }
  let limitInfo = { limit: limit, skip: skip };
  return limitInfo;
  //   limit and skip basic
  //what ever the order of limit and skip first always skip works and then limit
  // .limit("3").skip("2") it means firs skip 2 the  show 3 data if (there is data)
  //note .limit(3).skip(2) it is also valid but string is best approach
  //limit("").skip("")it does not skip any thing and gives all data(but in reality we do not show all data if it is needed do limit().skip())
};
let selectField = (_select) => {
  // if  selectString = "" it will show all field of document
  // if  selectString = "_id,name" it will show only _id and name field of document
  // if  selectString = "-name" it will show all field except  name
  let _selectStr = "";
  if (_select) {
    let _selectArr = _select.split(",");
    _selectStr = _selectArr.join(" ");
  }
  return _selectStr;
};
export let sortFilterPagination = catchAsyncErrors(async (req, res) => {
  // this reuse controller  must be used at last
  //but before that you must use middleware that gives
  //   req.find (must pass id you want to search)
  //   req.MyService (it is mandatory part)(and is a async function)
  //   req.myOwnSelect (if you have to hide document field from client side(eg password) at that case you should not use clien select)
  // note in select we should not use some part - , some part + ie use either + for all or - for all
  //req.myOwnSelect must be in format "a b"(here a and b is separated by space) or "-password"
  // for sorting
  let find = req.find || {};
  let service = req.service;
  let myOwnSelect = req.myOwnSelect;
  let sort = sortingFun(req.query._sort);
  //for pagination
  let { limit, skip } = getExactPageData(
    req.query._brake,
    req.query._page,
    req.query._showAllData
  );
  //for select
  let select = "";
  if (!myOwnSelect) {
    //for user, admin, customer and other has (to hide password)
    //thus if there is no req.myOwnSelect then  use client select else use myOwnSelect
    select = selectField(req.query._select);
  } else {
    select = myOwnSelect;
  }
  //for search
  let results = await service({ find, sort, limit, skip, select });
  let totalDataInAPage = results.length;
  let totalResults = await service({
    find: {},
    sort: "",
    limit: "",
    skip: "",
    select: "",
  });
  let totalDataInWholePage = totalResults.length;
  let totalPage = Math.ceil(totalDataInWholePage / limit);
  let currentPage = req.query._page || 1;
  let hasPreviousPage = currentPage > 1;
  let hasNextPage = currentPage < totalPage;
  let data = {
    results,
    totalDataInAPage,
    totalDataInWholePage,
    currentPage,
    totalPage,
    hasPreviousPage,
    hasNextPage,
  };
  successResponseData({
    res,
    message: "Read successfully.",
    statusCode: HttpStatus.OK,
    data,
  });
});