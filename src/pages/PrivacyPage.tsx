import React from 'react';
import Layout from '@/components/layout/Layout';
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Политика конфиденциальности</h1>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="lead">
            Фонд SCE придерживается строгих правил конфиденциальности для защиты личной информации своих сотрудников и данных о содержащихся объектах.
          </p>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <span>Сбор и использование информации</span>
          </h2>
          <p>
            Фонд SCE собирает персональную информацию для следующих целей:
          </p>
          <ul>
            <li>Идентификация и аутентификация сотрудников в системе</li>
            <li>Контроль доступа к секретным материалам в соответствии с уровнем допуска</li>
            <li>Отслеживание инцидентов безопасности и нарушений протоколов</li>
            <li>Ведение журналов активности для расследования возможных инцидентов</li>
          </ul>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <span>Доступ к информации</span>
          </h2>
          <p>
            Доступ к личной информации сотрудников строго ограничен и предоставляется только:
          </p>
          <ul>
            <li>Департаменту службы безопасности для идентификации и верификации личности</li>
            <li>Административному персоналу для координации рабочих процессов</li>
            <li>Руководителям соответствующих отделов для контроля рабочих показателей</li>
          </ul>

          <p>
            Вся информация о содержащихся объектах SCE классифицируется в соответствии с уровнями допуска. 
            Доступ к информации предоставляется только сотрудникам с соответствующим уровнем допуска.
          </p>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <span>Защита информации</span>
          </h2>
          <p>
            Фонд SCE использует передовые технологии шифрования и многоуровневые системы безопасности для защиты всех данных. 
            Наши серверы находятся в защищенных помещениях с ограниченным доступом и постоянным мониторингом.
          </p>

          <h2 className="mt-8 mb-4">Обновления политики конфиденциальности</h2>
          <p>
            Фонд SCE оставляет за собой право вносить изменения в данную политику конфиденциальности. 
            Все сотрудники будут уведомлены о значительных изменениях через внутреннюю систему коммуникации.
          </p>

          <div className="border-t border-border mt-8 pt-6">
            <p className="text-sm text-muted-foreground">
              Последнее обновление: {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Документ SCE-PRIV-2023-001
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
