import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Globe, Lock, BookOpen, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <ShieldAlert className="h-16 w-16 mx-auto text-accent mb-4" />
          <h1 className="text-3xl font-bold mb-4">О Фонде SCE</h1>
          <p className="text-xl">Secure. Control. Explore.</p>
        </div>

        <div className="sce-object prose prose-sm md:prose max-w-none">
          <h2>Наша миссия</h2>
          <p>
            Фонд SCE был основан с целью обнаружения, содержания и изучения аномальных объектов,
            сущностей и явлений, которые нарушают законы природы и представляют потенциальную угрозу
            для человечества и нашего понимания реальности.
          </p>
          <p>
            Наша миссия заключается в защите человечества от аномальных угроз, в сохранении привычной
            реальности и в расширении знаний о том, что лежит за пределами обычного понимания.
          </p>

          <h2>Основополагающие принципы</h2>
          <ul>
            <li>
              <strong>Secure (Защита)</strong> - Фонд SCE обнаруживает и помещает под контроль
              аномальные объекты и явления, чтобы предотвратить их влияние на общество и окружающую среду.
            </li>
            <li>
              <strong>Control (Контроль)</strong> - Мы разрабатываем специальные процедуры содержания
              для каждого аномального объекта, обеспечивая безопасность и минимизируя риски.
            </li>
            <li>
              <strong>Explore (Исследование)</strong> - Мы изучаем аномалии, чтобы понять их природу,
              свойства и потенциальное применение на благо человечества.
            </li>
          </ul>

          <h2>Структура Фонда</h2>
          <p>
            Фонд SCE действует как международная организация со множеством объектов и персонала по всему миру.
            Наша структура включает:
          </p>

          <h3>Отделы</h3>
          <ul>
            <li>
              <strong>Отдел исследований и разработки</strong> - Изучение и понимание аномальных объектов.
            </li>
            <li>
              <strong>Отдел безопасности и содержания</strong> - Обеспечение безопасного содержания аномальных объектов.
            </li>
            <li>
              <strong>Отдел полевых операций</strong> - Обнаружение и сбор аномальных объектов.
            </li>
            <li>
              <strong>Административный отдел</strong> - Управление ресурсами, персоналом и операциями Фонда.
            </li>
            <li>
              <strong>Этический комитет</strong> - Надзор за этическими аспектами деятельности Фонда.
            </li>
          </ul>

          <h3>Персонал</h3>
          <p>
            Фонд SCE нанимает лучших специалистов со всего мира, включая исследователей, агентов полевых операций,
            администраторов, специалистов по безопасности и вспомогательный персонал. Все сотрудники проходят
            строгую проверку и специальное обучение.
          </p>

          <h2>Классификация объектов</h2>
          <p>
            Фонд SCE классифицирует аномальные объекты в соответствии с их природой, уровнем опасности и
            сложностью содержания:
          </p>
          <ul>
            <li>
              <strong>Безопасный</strong> - Объекты, которые можно надежно содержать и которые не представляют
              значительной угрозы при соблюдении стандартных процедур.
            </li>
            <li>
              <strong>Евклид</strong> - Объекты, которые требуют более сложных процедур содержания и представляют
              умеренную угрозу в случае нарушения этих процедур.
            </li>
            <li>
              <strong>Кетер</strong> - Чрезвычайно опасные объекты, трудно поддающиеся содержанию и представляющие
              серьезную угрозу.
            </li>
            <li>
              <strong>Таумиэль</strong> - Редкая классификация для объектов, которые используются Фондом для
              содержания или противодействия другим аномалиям.
            </li>
            <li>
              <strong>Нейтрализованный</strong> - Объекты, которые больше не проявляют аномальных свойств.
            </li>
          </ul>

          <h2>История</h2>
          <p>
            Фонд SCE был основан в начале 20-го века группой ученых и исследователей, столкнувшихся с
            необъяснимыми явлениями. Осознав масштаб угрозы, которую представляют такие аномалии, они
            создали организацию для изучения и контроля этих объектов.
          </p>
          <p>
            За прошедшие годы Фонд вырос от небольшой группы исследователей до глобальной организации,
            действующей во всех уголках мира и взаимодействующей с правительствами и другими организациями
            для защиты человечества.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="sce-object text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-lg font-bold mb-2">Наши люди</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Фонд SCE объединяет лучших экспертов, ученых и агентов со всего мира.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/personnel">Наш персонал</Link>
            </Button>
          </div>

          <div className="sce-object text-center">
            <div className="flex justify-center mb-4">
              <FlaskConical className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-lg font-bold mb-2">Исследования</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Исследование аномалий расширяет наше понимание реальности.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/research">Наши исследования</Link>
            </Button>
          </div>

          <div className="sce-object text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-lg font-bold mb-2">Безопасность</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Мы обеспечиваем защиту человечества от аномальных угроз.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/security">Меры безопасности</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 mb-6 text-center">
          <p className="text-muted-foreground">
            Заинтересованы в работе с нами? Фонд SCE всегда ищет талантливых специалистов.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link to="/careers">Присоединиться к Фонду SCE</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
