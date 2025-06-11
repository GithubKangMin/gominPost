'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  Grid,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';

interface Worry {
  id: number;
  nickname: string;
  category: string;
  content: string;
  createdAt: string;
}

export default function VolunteerDashboard() {
  const router = useRouter();
  const [worries, setWorries] = useState<Worry[]>([]);
  const [selectedWorry, setSelectedWorry] = useState<Worry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [loadingWorries, setLoadingWorries] = useState(true);
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 로그인 체크 및 토큰 가져오기
    const token = localStorage.getItem('token');
    const volunteer = localStorage.getItem('volunteer');
    if (!token || !volunteer) {
      router.push('/login');
      return;
    }

    // 고민 목록 가져오기
    fetchWorries(token);
  }, []);

  const fetchWorries = async (token: string) => {
    setError('');
    setLoadingWorries(true);
    try {
      const response = await fetch('/api/worries', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWorries(data);
      } else if (response.status === 401) {
        // 토큰 만료 또는 인증 실패
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        localStorage.removeItem('volunteer');
        router.push('/login');
      } else {
        console.error('고민 목록을 가져오는데 실패했습니다.');
        setError('고민 목록을 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('고민 목록을 가져오는 중 오류 발생:', error);
      setError('고민 목록을 가져오는 중 오류 발생');
    } finally {
      setLoadingWorries(false);
    }
  };

  const handleWorrySelect = (worry: Worry) => {
    setSelectedWorry(worry);
    setResponseText('');
    setError('');
  };

  const handleResponseSubmit = async () => {
    setError('');
    if (!selectedWorry || !responseText.trim()) {
      setError('답변 내용을 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token');
    const volunteer = JSON.parse(localStorage.getItem('volunteer') || '{}');

    if (!token || !volunteer.id) {
        alert('봉사자 정보가 없습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        localStorage.removeItem('volunteer');
        router.push('/login');
        return;
    }

    setSubmittingResponse(true);

    try {
      const response = await fetch(`/api/responses/worry/${selectedWorry.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: responseText,
          volunteerId: volunteer.id,
        }),
      });

      if (response.ok) {
        const createdResponse = await response.json();
        console.log('답변 작성 성공:', createdResponse);
        alert('답변이 성공적으로 저장되었습니다.');
        setResponseText('');
        setSelectedWorry(null);
        // 고민 목록 새로고침
        fetchWorries(token);
      } else if (response.status === 401) {
         alert('인증이 만료되었습니다. 다시 로그인해주세요.');
         localStorage.removeItem('token');
         localStorage.removeItem('volunteer');
         router.push('/login');
      } else {
        const errorData = await response.json();
        console.error('답변 작성 실패:', errorData);
        setError('답변 작성 실패: ' + (errorData.message || response.statusText));
      }
    } catch (error) {
      console.error('답변 작성 중 오류 발생:', error);
      setError('답변 작성 중 오류 발생');
    } finally {
        setSubmittingResponse(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff3e0', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
          <LocalPostOfficeIcon sx={{ fontSize: 40, color: '#e65100', mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }} />
          <Typography variant="h4" component="h1" color="#e65100" align={{
            xs: 'center', sm: 'left'
          }}>
            봉사자 대시보드
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {/* 고민 목록 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" color="#e65100" gutterBottom>
                답변 대기 중인 고민
              </Typography>
              {loadingWorries ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress color="inherit" />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {worries.length > 0 ? (worries.map((worry) => (
                    <Card
                      key={worry.id}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        bgcolor: selectedWorry?.id === worry.id ? '#fff3e0' : 'white',
                        '&:hover': {
                          bgcolor: '#fff3e0',
                        },
                      }}
                      onClick={() => handleWorrySelect(worry)}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        {worry.nickname}의 고민
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {worry.category}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {worry.content.length > 100
                          ? worry.content.substring(0, 100) + '...'
                          : worry.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {new Date(worry.createdAt).toLocaleDateString()}
                      </Typography>
                    </Card>
                  ))): (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                        새로운 고민이 없습니다.
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* 답변 작성 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" color="#e65100" gutterBottom>
                답변 작성
              </Typography>
              {selectedWorry ? (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    {selectedWorry.nickname}님의 고민
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {selectedWorry.content}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="답변 내용을 입력해주세요..."
                    variant="outlined"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={submittingResponse}
                  />
                  {error && !loadingWorries && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleResponseSubmit}
                    sx={{
                      bgcolor: '#ff7043',
                      '&:hover': {
                        bgcolor: '#f4511e',
                      },
                    }}
                    startIcon={submittingResponse ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
                    fullWidth
                    disabled={submittingResponse}
                  >
                    {submittingResponse ? '제출 중' : '답변 제출'}
                  </Button>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  답변할 고민을 선택해주세요.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 