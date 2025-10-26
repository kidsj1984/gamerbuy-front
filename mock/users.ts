import faker from 'faker'
import { Response, Request } from 'express'
import { IUserData } from '../src/api/types'

const getCookies = function(req: Request) {
  const Cookies:any = {};
  if (req.headers.cookie != null) {
    req.headers.cookie.split(';').forEach(l => {
      const parts = l.split('=');
      Cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  }

  return Cookies;
}

const userList: IUserData[] = [
  {
    id: 0,
    phone: '1234567890',
    password: '123456',
    name: 'Super Admin',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am a super administrator',
    email: 'admin@test.com',
    roles: ['admin'],
    identity: 0,
    token: '',
  },
  {
    id: 1,
    phone: '1234567891',
    password: '123456',
    name: 'Super Admin',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am a super administrator',
    email: 'admin@test.com',
    roles: ['editor'],
    identity: 1,
    token: '',
  },
  {
    id: 2,
    phone: '1234567892',
    password: '123456',
    name: 'Normal Editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am an editor',
    email: 'editor@test.com',
    roles: ['editor'],
    identity: 2,
    token: '',
  },
  {
    id: 3,
    phone: '1234567893',
    password: '123456',
    name: 'Normal Editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am an editor',
    email: 'editor@test.com',
    roles: ['editor'],
    identity: 3,
    token: '',
  },
  {
    id: 4,
    phone: '1234567894',
    password: '123456',
    name: 'Normal Editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am an editor',
    email: 'editor@test.com',
    roles: ['editor'],
    identity: 4,
    token: '',
  },
  {
    id: 5,
    phone: '1234567895',
    password: '123456',
    name: 'Normal Editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am an editor',
    email: 'editor@test.com',
    roles: ['editor'],
    identity: 5,
    token: '',
  }
]
const userCount = 100

// for (let i = 2; i < userCount; i++) {
//   userList.push({
//     id: i,
//     username: 'user_' + faker.random.alphaNumeric(9),
//     password: faker.random.alphaNumeric(20),
//     name: faker.name.findName(),
//     avatar: faker.image.imageUrl(),
//     introduction: faker.lorem.sentence(20),
//     email: faker.internet.email(),
//     phone: faker.phone.phoneNumber(),
//     roles: ['visitor']
//   })
// }

console.log('userList1111', userList);

export const register = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const login = (req: Request, res: Response) => {
  const { phone } = req.body
  for (const user of userList) {
    console.log(user.phone === phone)
    if (user.phone === phone) {
      const token = phone + '-token';
      user.token = token;
      return res.json({
        code: 20000,
        data: {
          accessToken: token
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid User'
  })
}

export const logout = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const getUsers = (req: Request, res: Response) => {
  const { name } = req.query
  const users = userList.filter(user => {
    const lowerCaseName = user.name.toLowerCase()
    return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
  })
  return res.json({
    code: 20000,
    data: {
      items: users
    }
  })
}

export const getUserInfo = (req: Request, res: Response) => {
  const cookies = getCookies(req);
  const token = cookies && cookies.vue_typescript_admin_access_token;

  const users = userList.filter(user => (user.token === token))[0];
  // Mock data based on access token
  return res.json({
    code: 20000,
    data: {
      user: users
    }
  })
}

export const getUserByName = (req: Request, res: Response) => {
  const { phone } = req.params
  for (const user of userList) {
    if (user.phone === phone) {
      return res.json({
        code: 20000,
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid User'
  })
}

export const updateUser = (req: Request, res: Response) => {
  const { phone } = req.params
  const { user } = req.body
  for (const v of userList) {
    if (v.phone === phone) {
      return res.json({
        code: 20000,
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid User'
  })
}

export const deleteUser = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}
