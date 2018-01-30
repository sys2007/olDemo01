let pagehelper = function (arr, pageSize, currPage) {
  let table_slice = []
  let begin = pageSize * (currPage - 1)
  let end = pageSize * currPage
  table_slice = arr.slice(begin, end)
  return table_slice
}
export default pagehelper 
