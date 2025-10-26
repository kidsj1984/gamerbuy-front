export const path = '/Steamorder/GetLogs'
export const method = 'get'

export const response = {
  status: 'steamloginsuccess',
  data: [
    {
      id: 15,
      orderid: '2022021314021492740987984941056',
      logtype: 'cdkey',
      orderStatus: '1',
      orderContent: 'submitOrder',
      orderOperator: '用户',
      orderOperatorTime: '\/Date(1644732160000+0800)\/',
      orderOperatorTimeutc: 1644760960000,
      uid: 1
    },
    {
      id: 16,
      orderid: '2022021314021492740987984941056',
      logtype: 'cdkey',
      orderStatus: '1',
      orderContent: 'cashSuccess',
      orderOperator: '用户',
      orderOperatorTime: '\/Date(1644732311000+0800)\/',
      orderOperatorTimeutc: 1644761111000,
      uid: 1
    },
  ]
}

// export const response = {
//   status: 'submitorder',
//   data: [
//     {
//       id: 201,
//       orderid: '2022111313171591661479168446464',
//       logtype: 'cdkey',
//       orderStatus: '1',
//       orderContent: 'submitOrder',
//       orderOperator: '用户',
//       orderOperatorTime: '\/Date(1668316643000+0800)\/',
//       orderOperatorTimeutc: 1668316643000,
//       uid: 4
//     }
//   ]
// }

