import { Center, Loader, Space, Text } from '@mantine/core';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function LogOut() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      navigate('/auth/login');
    })();
  }, []);

  return (
    <>
      <Text size="sm" align="center" mt={5}>
        {t('auth:logging_out')}
      </Text>
      <Space h="md" />
      <Center>
        <Loader color="teal" />
      </Center>
    </>
  );
}

export default LogOut;
