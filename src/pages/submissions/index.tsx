import PublishIcon from '@mui/icons-material/Publish'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Loading from '@/components/atoms/Loading'
import { useAuthContext } from '@/components/contexts/AuthProvider'
import SubmissionsTable from '@/components/molecules/SubmissionsTable'
import BasicLayout from '@/components/templates/BasicLayout'
import { useSubmissionList } from '@/features/api'

const Submissions: NextPage = () => {
  const router = useRouter()
  const { user_id } = router.query
  const { user } = useAuthContext()
  const { submissionListResponse, isLoading, isError } = useSubmissionList(
    Number(user_id),
  )

  useEffect(() => {
    if (submissionListResponse?.status === 'login-required') {
      router.push('/login')
    }
  }, [submissionListResponse?.status])

  if (isError) {
    return <Error statusCode={isError.status} title={isError.message} />
  }

  if (
    isLoading ||
    !submissionListResponse ||
    submissionListResponse.status === 'login-required'
  ) {
    return <Loading />
  }

  if (submissionListResponse.status === 'ng') {
    return <Error statusCode={0} title={submissionListResponse.errorMessage} />
  }

  return (
    <>
      <Head>
        <title>submissions | HCCC</title>
        <meta name='description' content='人間Cコンパイラーコンテスト' />
      </Head>

      <BasicLayout>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <PublishIcon fontSize='large' sx={{ marginRight: '0.2rem' }} />
          <Typography variant='h4' sx={{ fontWeight: '600' }}>
            {Number(user_id) === user?.id ? 'My Submit' : 'Submit'}
          </Typography>
        </Box>
        <SubmissionsTable submissionList={submissionListResponse.items} />
      </BasicLayout>
    </>
  )
}

export default Submissions
