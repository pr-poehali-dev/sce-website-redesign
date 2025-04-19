import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert, FilePlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';

const formSchema = z.object({
  code: z.string().min(3, { message: 'Код объекта должен содержать не менее 3 символов' }),
  name: z.string().min(3, { message: 'Название объекта должно содержать не менее 3 символов' }),
  objectClass: z.enum(['безопасный', 'евклид', 'кетер', 'таумиэль', 'нейтрализованный'], {
    required_error: 'Выберите класс объекта',
  }),
  containmentProcedures: z.string().min(20, { message: 'Процедуры содержания должны быть более подробными' }),
  description: z.string().min(20, { message: 'Описание должно быть более подробным' }),
  requiredClearance: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateObjectPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: 'SCE-',
      name: '',
      objectClass: 'безопасный',
      containmentProcedures: '',
      description: '',
      requiredClearance: '1',
    },
  });

  React.useEffect(() => {
    // Проверка прав доступа
    if (!user || !isAdmin) {
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав для создания объектов SCE",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, isAdmin, navigate, toast]);

  const onSubmit = (values: FormValues) => {
    if (!user) return;

    try {
      const newObject = storage.createSCEObject({
        code: values.code,
        name: values.name,
        objectClass: values.objectClass as any,
        containmentProcedures: values.containmentProcedures,
        description: values.description,
        createdBy: user.id,
        requiredClearance: parseInt(values.requiredClearance),
      });

      toast({
        title: "Объект создан",
        description: `Объект ${values.code} успешно создан и добавлен в базу данных`,
      });

      navigate(`/objects/${newObject.id}`);
    } catch (error) {
      console.error('Ошибка при создании объекта:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать объект. Пожалуйста, попробуйте еще раз",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FilePlus className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold">Создание нового объекта SCE</h1>
        </div>

        <div className="sce-object">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Код объекта</FormLabel>
                      <FormControl>
                        <Input placeholder="SCE-001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Уникальный идентификатор объекта (например, SCE-001)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredClearance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Требуемый уровень доступа</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите уровень доступа" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Уровень 1</SelectItem>
                          <SelectItem value="2">Уровень 2</SelectItem>
                          <SelectItem value="3">Уровень 3</SelectItem>
                          <SelectItem value="4">Уровень 4</SelectItem>
                          <SelectItem value="5">Уровень 5 (высший)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Минимальный уровень доступа для просмотра информации об объекте
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название объекта</FormLabel>
                    <FormControl>
                      <Input placeholder="Название объекта" {...field} />
                    </FormControl>
                    <FormDescription>
                      Краткое описательное название объекта
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="objectClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Класс объекта</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите класс объекта" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="безопасный">Безопасный</SelectItem>
                        <SelectItem value="евклид">Евклид</SelectItem>
                        <SelectItem value="кетер">Кетер</SelectItem>
                        <SelectItem value="таумиэль">Таумиэль</SelectItem>
                        <SelectItem value="нейтрализованный">Нейтрализованный</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Классификация объекта по уровню опасности и сложности содержания
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="containmentProcedures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Процедуры содержания</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Подробное описание процедур содержания объекта..." 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Детальное описание мер и процедур для содержания объекта
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Подробное описание объекта..." 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Подробное описание объекта, его свойств и особенностей
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" className="w-full md:w-auto">
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  <span>Создать объект SCE</span>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateObjectPage;
