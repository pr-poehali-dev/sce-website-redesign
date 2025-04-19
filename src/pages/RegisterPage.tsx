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
  username: z.string().min(3, { message: 'Имя пользователя должно содержать не менее 3 символов' }),
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(6, { message: 'Пароль должен содержать не менее 6 символов' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    const success = await register(values.email, values.username, values.password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-12">
        <div className="flex flex-col items-center mb-8">
          <ShieldAlert className="h-12 w-12 text-accent mb-4" />
          <h1 className="text-2xl font-bold">Регистрация в системе SCE</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Создайте учетную запись для доступа к системе Фонда SCE
          </p>
        </div>

        <div className="sce-object">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <Input placeholder="Имя пользователя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтверждение пароля</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Зарегистрироваться</Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-accent hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </div>

        <div className="sce-warning mt-6">
          <p className="text-sm">
            <strong>ВНИМАНИЕ:</strong> Регистрируясь в системе SCE, вы соглашаетесь соблюдать все протоколы безопасности
            и правила конфиденциальности Фонда. Нарушение этих правил может привести к дисциплинарным мерам.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
