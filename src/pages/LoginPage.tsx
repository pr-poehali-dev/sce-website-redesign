import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';

const formSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(1, { message: 'Введите пароль' }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    const success = await login(values.email, values.password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-12">
        <div className="flex flex-col items-center mb-8">
          <ShieldAlert className="h-12 w-12 text-accent mb-4" />
          <h1 className="text-2xl font-bold">Вход в систему SCE</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Введите ваши данные для входа в систему Фонда SCE
          </p>
        </div>

        <div className="sce-object">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Войти</Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-accent hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        <div className="sce-warning mt-6">
          <p className="text-sm">
            <strong>ВНИМАНИЕ:</strong> Несанкционированный доступ к системе SCE строго запрещен.
            Все попытки несанкционированного доступа регистрируются и могут повлечь за собой серьезные последствия.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
