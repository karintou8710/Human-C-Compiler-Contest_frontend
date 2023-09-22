import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import React, { FC, KeyboardEventHandler } from 'react'
import { useForm } from 'react-hook-form'
import TitleLabel from '@/components/atoms/TitleLabel'
import { SubmitFormSchema, submitFormSchema } from '@/features/yupSchema'

type SubmitSectionProps = {
  hasWCSubmission: boolean
  errorMessage: string
  onSubmit: (data: SubmitFormSchema) => void
  sx?: SxProps<Theme>
}

const SubmitSection: FC<SubmitSectionProps> = ({
  hasWCSubmission,
  errorMessage,
  onSubmit,
  sx,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<SubmitFormSchema>({
    resolver: yupResolver(submitFormSchema),
  })
  const isCEChecked = watch('isCE')

  const handleKeyDown: KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const value = target.value

    if (e.key === 'Tab') {
      e.preventDefault()

      const cursorPosition = target.selectionStart
      const cursorEndPosition = target.selectionEnd
      const tab = '\t'
      if (cursorPosition === null || cursorEndPosition === null) {
        return
      }

      target.value =
        value.substring(0, cursorPosition) +
        tab +
        value.substring(cursorEndPosition)

      target.selectionStart = cursorPosition + 1
      target.selectionEnd = cursorPosition + 1
    }
  }

  return (
    <Box sx={sx}>
      <TitleLabel label='Submission' sx={{ mb: '2rem' }} />

      {hasWCSubmission ? (
        <Typography
          variant='h5'
          sx={{
            mt: '5rem',
            bgcolor: '#ef5350',
            color: 'white',
            lineHeight: '1.5',
            fontWeight: '600',
            p: '2rem',
          }}
        >
          正しいコードに対し,コンパイルエラーが提出されました. <br />
          この問題を再び回答することはできません.
          <br />
          詳細は
          <a
            href='https://github.com/Alignof/Human_C_Compiler_Contest'
            target='_black'
          >
            レギュレーション
          </a>
          をご確認ください.
        </Typography>
      ) : (
        <Box>
          <Box sx={{ m: '2rem 0' }}>
            {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          </Box>

          <FormControlLabel
            label='Compile Error'
            control={
              <Switch
                {...register('isCE', {
                  onChange: () => {
                    clearErrors()
                  },
                })}
              />
            }
          />

          <TextField
            color='primary'
            label='submission'
            variant='filled'
            rows={10}
            multiline
            fullWidth
            placeholder='input assembly'
            error={'asm' in errors}
            helperText={errors.asm?.message ?? ''}
            {...register('asm')}
            InputProps={{
              onKeyDown: handleKeyDown,
            }}
            disabled={isCEChecked}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', m: '4rem' }}>
            <Button
              variant='contained'
              size='large'
              sx={{
                width: '300px',
                py: '1.2rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default SubmitSection
