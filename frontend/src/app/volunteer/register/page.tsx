import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

const VolunteerRegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/volunteer/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                alert('회원가입 성공! 로그인 페이지로 이동합니다.');
                router.push('/volunteer/login'); // Assuming a login page exists at /volunteer/login
            } else {
                const errorData = await response.json();
                alert(`회원가입 실패: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    봉사자 회원가입
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    고민우체국 봉사자 계정을 생성해주세요
                </Typography>
            </Box>
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
                 <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="이메일 주소"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="비밀번호 확인"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    회원가입
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">
                        이미 계정이 있으신가요? <a href="/volunteer/login">로그인</a>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default VolunteerRegisterPage; 