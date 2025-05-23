import {useForm} from 'react-hook-form'
import {Link, useNavigate} from 'react-router-dom'
import {yupResolver} from '@hookform/resolvers/yup'
import {schema, Schema} from 'src/utils/rules'
import {useMutation} from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import {isAxiosUnprocessableEntityError} from 'src/utils/utils'
import {ErrorResponse} from 'src/types/utils.type'
import Input from 'src/components/Input'
import {useContext, useState} from 'react'
import {AppContext} from 'src/contexts/app.context'
import Button from 'src/components/Button'
import {Helmet} from 'react-helmet-async'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from '@mui/material'
import LoginQR from "../../components/LoginQR/LoginQR";
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const {setIsAuthenticated, setProfile} = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const [openQR, setOpenQR] = useState(false)

  const handleOpenQR = () => setOpenQR(true)
  const handleCloseQR = () => setOpenQR(false)

  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.loginMock(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <Helmet>
        <title>Đăng nhập | Shopee Clone</title>
        <meta name='description' content='Đăng nhập vào dự án Shopee Clone'/>
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-6 lg:py-12 lg:pr-10'>
          <div className='lg:col-span-4 hidden lg:block'>
            <img src={'/img/login_bg.png'} className='w-full h-full object-contain'
                 alt='Shopee Login Background'/>
          </div>
          <div className='lg:col-span-2'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className="flex justify-between items-center">
                <div className='text-2xl'>Đăng nhập</div>

                <Box
                  onClick={handleOpenQR}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1,
                    backgroundColor: '#FFF9E6',
                    border: '2px solid #FFA500',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 0 0 2px #FFCF66'
                    }
                  }}
                >
                  <Typography variant='body2' sx={{color: '#FFA500', fontWeight: 500, mr: 1}}>
                    Log in with QR
                  </Typography>
                  <QrCodeIcon sx={{color: '#FF5722'}}/>
                </Box>
              </div>

              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                placeholder='Email/Số điện thoại/Tên đăng nhập'
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-2'
                classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                errorMessage={errors.password?.message}
                placeholder='Mật khẩu'
                autoComplete='on'
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex  w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='flex justify-between'>
                <Link className='mt-3 text-blue-700' to='/forgot-password'>
                  Quên mật khẩu?
                </Link>
                <Link className='mt-3 text-blue-700 ml-3' to='/reset-password'>
                  Đăng nhập với SMS
                </Link>
              </div>
              <div className='m-3 mb-5'>
                <Divider
                  sx={{
                    color: 'gray',
                    fontSize: '0.85rem'
                  }}
                >
                  HOẶC
                </Divider>
              </div>

              <Dialog open={openQR} onClose={handleCloseQR} maxWidth="sm" fullWidth>
                <DialogTitle>
                  Quét mã QR để đăng nhập
                  <IconButton onClick={handleCloseQR} sx={{position: 'absolute', right: 8, top: 8}}>
                    <CloseIcon/>
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <LoginQR/>
                </DialogContent>
              </Dialog>


              <div className='flex gap-3'>
                <Button
                  type='submit'
                  className='flex  w-full  border-2 border-gray-300 justify-center text-black py-4 px-2 text-sm uppercase b hover:1bg-red-600'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                >
                  Facebook
                </Button>
                {/*<Button*/}
                {/*  type='submit'*/}
                {/*  className='flex  w-full  border-2 border-gray-300 justify-center text-black py-4 px-2 text-sm uppercase b hover:bg-red-600'*/}
                {/*  isLoading={loginMutation.isLoading}*/}
                {/*  disabled={loginMutation.isLoading}*/}
                {/*>*/}
                {/*  Google*/}
                {/*</Button>*/}

                <Button
                  type='button'
                  className='flex w-full border-2 border-gray-300 justify-center text-black py-4 px-2 text-sm uppercase hover:bg-gray-100'
                  onClick={() => window.location.href = 'http://localhost:4006/api/v1/oauth2/authorize/google'}
                >
                  Google
                </Button>

                <Button
                  type='button'
                  className='flex w-full border-2 border-gray-300 justify-center text-black py-4 px-2 text-sm uppercase hover:bg-gray-100'
                  onClick={() => window.location.href = 'http://localhost:4006/api/v1/oauth2/authorize/github'}
                >
                  Github
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn mới biết đến Shopee?</span>
                <Link className='ml-1 text-red-400' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
