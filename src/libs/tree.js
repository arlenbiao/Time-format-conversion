/**
 * tree操作
 * @param arr 节点数组
 * @param checkArr 选中数
 */
export function tree (arr, checkArr) {
  console.log('节点树', arr)
  console.log('选中', checkArr)
  for (let i = 0; i < arr.length; i++) {
    if (checkArr.includes(arr[i].level)) {
      arr[i].checked = true
    }
    if (arr[i].children.length !== 0) {
      tree(arr[i].children, checkArr)
    }
  }
}
