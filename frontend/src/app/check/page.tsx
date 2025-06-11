'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  Divider,
} from '@mui/material';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';

interface Response {
  id: number;
  content: string;
  volunteerName: string;
  createdAt: string;
}

interface Worry {
  id: number;
  nickname: string;
  category: string;
  content: string;
  createdAt: string;
  responses: Response[];
}

export default function CheckWorry() {
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
  });
  const [worry, setWorry] = useState<Worry | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력 시 에러 메시지 초기화
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nickname || !formData.password) {
      setError('닉네임과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/worries/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setWorry(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || '고민을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('고민 확인 중 오류 발생:', error);
      setError('고민 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff3e0', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
          <LocalPostOfficeIcon sx={{ fontSize: 40, color: '#e65100', mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }} />
          <Typography variant="h4" component="h1" color="#e65100" align={{
            xs: 'center', sm: 'left'
          }}>
            고민 확인하기
          </Typography>
        </Box>

        {!worry ? (
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" color="#e65100" gutterBottom>
              고민 확인
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              닉네임과 비밀번호를 입력하여 작성한 고민과 답변을 확인하세요.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="닉네임"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="비밀번호"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: '#ff7043',
                  '&:hover': {
                    bgcolor: '#f4511e',
                  },
                }}
              >
                확인하기
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" color="#e65100" gutterBottom>
              {worry.nickname}님의 고민
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {worry.category} • {new Date(worry.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" sx={{ my: 3 }}>
              {worry.content}
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" color="#e65100" gutterBottom>
              답변 {worry.responses.length}개
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {worry.responses.map((response) => (
                <Card key={response.id} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {response.volunteerName} 봉사자
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {response.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(response.createdAt).toLocaleDateString()}
                  </Typography>
                </Card>
              ))}
            </Box>
            <Button
              variant="outlined"
              onClick={() => setWorry(null)}
              sx={{
                mt: 3,
                color: '#e65100',
                borderColor: '#ff7043',
                '&:hover': {
                  borderColor: '#f4511e',
                  bgcolor: '#fff3e0',
                },
              }}
            >
              다른 고민 확인하기
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
} 