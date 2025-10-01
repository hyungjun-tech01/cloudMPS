import MaterialIcon from '@/app/components/materialIcon';


export default function Card({
  title,
  type,
  value
}: {
  title: string;
  type: string;
  value: Record<string, Record<string, number|string>>;
}) {

  switch(type) {
    case "monthlyUsage":
      return (
        <div className="flex-1 rounded-xl bg-slate-100 p-2 shadow-sm border border-slate-300">
          <div className="flex p-4">
            <MaterialIcon name="circle" props={`h-4 w-4 text-slate-600`} />
            <h3 className="ml-4 text-base">{title}</h3>
          </div>
          <div className="flex flex-col">
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div>자동</div>
                <div>{value.auto.current}/{value.auto.total}</div>
                <div>미생성 {value.auto.error}</div>
              </div>
              <div className='flex flex-col'>
                <div>{value.auto.period}</div>
                <div className='flex justify-between'>
                  <div>대상</div>
                  <div>{value.auto.target}</div>
                </div>
                <div className='flex justify-between'>
                  <div>생성</div>
                  <div>{value.auto.created}</div>
                </div>
                <div className='flex justify-between'>
                  <div>미생성</div>
                  <div>{value.auto.not_created}</div>
                </div>
              </div>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div>수동</div>
                <div>{value.manual.current}/{value.manual.total}</div>
                <div>미생성 {value.manual.error}</div>
              </div>
              <div className='flex flex-col'>
                <div>{value.manual.period}</div>
                <div className='flex justify-between'>
                  <div>대상</div>
                  <div>{value.manual.target}</div>
                </div>
                <div className='flex justify-between'>
                  <div>생성</div>
                  <div>{value.manual.created}</div>
                </div>
                <div className='flex justify-between'>
                  <div>미생성</div>
                  <div>{value.manual.not_created}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "sales":
      return (
        <div className="flex-1 rounded-xl bg-slate-100 p-2 shadow-sm  border border-slate-300">
          <div className="flex p-4">
            <MaterialIcon name="circle" props={`h-4 w-4 text-slate-600`} />
            <h3 className="ml-4 text-base">{title}</h3>
          </div>
          <div className="flex flex-col justify-between">
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div>자동</div>
                <div>{value.auto.current}/{value.auto.total}</div>
                <div>미생성 {value.auto.error}</div>
              </div>
              <div className='flex flex-col'>
                <div>{value.auto.period}</div>
                <div className='flex justify-between'>
                  <div>대상</div>
                  <div>{value.auto.target}</div>
                </div>
                <div className='flex justify-between'>
                  <div>생성</div>
                  <div>{value.auto.created}</div>
                </div>
                <div className='flex justify-between'>
                  <div>미생성</div>
                  <div>{value.auto.not_created}</div>
                </div>
              </div>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div>수동</div>
                <div>{value.manual.current}/{value.manual.total}</div>
                <div>미생성 {value.manual.error}</div>
              </div>
              <div className='flex flex-col'>
                <div>{value.manual.period}</div>
                <div className='flex justify-between'>
                  <div>대상</div>
                  <div>{value.manual.target}</div>
                </div>
                <div className='flex justify-between'>
                  <div>생성</div>
                  <div>{value.manual.created}</div>
                </div>
                <div className='flex justify-between'>
                  <div>미생성</div>
                  <div>{value.manual.not_created}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "as":
      return (
        <div className="flex-1 rounded-xl bg-slate-100 p-2 shadow-sm  border border-slate-300">
          <div className="flex p-4">
            <MaterialIcon name="circle" props={`h-4 w-4 text-slate-600`} />
            <h3 className="ml-4 text-base">{title}</h3>
          </div>
          <div className="flex flex-col">
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div>자동 접수</div>
                <div>{value.auto.value}</div>
              </div>
              <div className='flex flex-col'>
                <div>현황</div>
                <div className='flex justify-between'>
                  <div>접수</div>
                  <div>{value.auto.applied}</div>
                </div>
                <div className='flex justify-between'>
                  <div>대기</div>
                  <div>{value.auto.waiting}</div>
                </div>
                <div className='flex justify-between'>
                  <div>진행</div>
                  <div>{value.auto.processing}</div>
                </div>
                <div className='flex justify-between'>
                  <div>취소</div>
                  <div>{value.auto.canceled}</div>
                </div>
                <div className='flex justify-between'>
                  <div>완료</div>
                  <div>{value.auto.completed}</div>
                </div>
                <div className='flex justify-between'>
                  <div>보류</div>
                  <div>{value.auto.postponed}</div>
                </div>
              </div>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div>수동 접수</div>
                <div>{value.manual.value}</div>
              </div>
              <div className='flex flex-col'>
                <div>현황</div>
                <div className='flex justify-between'>
                  <div>접수</div>
                  <div>{value.manual.applied}</div>
                </div>
                <div className='flex justify-between'>
                  <div>대기</div>
                  <div>{value.manual.waiting}</div>
                </div>
                <div className='flex justify-between'>
                  <div>진행</div>
                  <div>{value.manual.processing}</div>
                </div>
                <div className='flex justify-between'>
                  <div>취소</div>
                  <div>{value.manual.canceled}</div>
                </div>
                <div className='flex justify-between'>
                  <div>완료</div>
                  <div>{value.manual.completed}</div>
                </div>
                <div className='flex justify-between'>
                  <div>보류</div>
                  <div>{value.manual.postponed}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "monitor":
      return (
        <div className="flex-1 rounded-xl bg-slate-100 p-2 shadow-sm  border border-slate-300">
          <div className="flex p-4">
            <MaterialIcon name="circle" props={`h-4 w-4 text-slate-600`} />
            <h3 className="ml-4 text-base">{title}</h3>
          </div>
          <div className="flex flex-col">
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div>신규</div>
                <div>{value.updated.current}</div>
              </div>
              <div className='flex flex-col'>
                <div>누적</div>
                <div className='flex justify-between'>
                  <div>당월</div>
                  <div>{value.updated.thisMonth}</div>
                </div>
                <div className='flex justify-between'>
                  <div>전월</div>
                  <div>{value.updated.lastMonth}</div>
                </div>
              </div>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div>잉크젯</div>
                <div>{value.ink.current}/{value.ink.total}</div>
              </div>
              <div className='flex flex-col'>
                <div>지연/잔량 부족</div>
                <div className='flex justify-between'>
                  <div>3~4일</div>
                  <div>{value.ink.until4}</div>
                </div>
                <div className='flex justify-between'>
                  <div>4~30일</div>
                  <div>{value.ink.until30}</div>
                </div>
                <div className='flex justify-between'>
                  <div>40일 이상</div>
                  <div>{value.ink.over40}</div>
                </div>
                <div className='flex justify-between'>
                  <div>잉크 부족</div>
                  <div>{value.ink.lowSupply}</div>
                </div>
              </div>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div>레이저</div>
                <div>{value.laser.current}/{value.laser.total}</div>
              </div>
              <div className='flex flex-col'>
                <div>지연/잔량 부족</div>
                <div className='flex justify-between'>
                  <div>3~4일</div>
                  <div>{value.laser.until4}</div>
                </div>
                <div className='flex justify-between'>
                  <div>4~30일</div>
                  <div>{value.laser.until30}</div>
                </div>
                <div className='flex justify-between'>
                  <div>40일 이상</div>
                  <div>{value.laser.over40}</div>
                </div>
                <div className='flex justify-between'>
                  <div>잉크 부족</div>
                  <div>{value.laser.lowSupply}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
}
