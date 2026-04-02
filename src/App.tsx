import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  MoreHorizontal, 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Bell, 
  User,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Trash2,
  Edit3,
  Zap,
  Building2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type ProductStatus = '全部' | '编辑中' | '待审核' | '审核通过' | '审核不通过';
type MenuType = 'product' | 'crane' | 'lift' | 'standard_part' | 'enterprise_reg';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  specification: string;
  brand: string;
  batchNumber: string;
  status: ProductStatus;
}

interface StandardPartArchive {
  variety: string;
  factoryNo: string;
  factoryDate?: string;
}

interface Equipment {
  id: string;
  factoryNo: string;
  variety: string;
  category: string;
  model: string;
  code: string;
  factoryDate: string;
  status: ProductStatus;
  mainMachineNo?: string;
  manufacturer?: string;
  standardPartArchives?: StandardPartArchive[];
}

// --- Constants ---

const PRODUCT_CATEGORIES: Record<string, string[]> = {
  '建材': ['混凝土', '钢材', '木材', '水泥', '砂石'],
  '装饰材料': ['涂料', '瓷砖', '地板', '壁纸', '灯具'],
  '化工': ['防水涂料', '密封胶', '外加剂'],
  '机电设备': ['泵', '电机', '变压器', '开关柜'],
};

const EQUIPMENT_HIERARCHY: Record<string, string[]> = {
  '塔式起重机': ['平头式塔式起重机', '动臂式塔式起重机', '其他'],
  '桥式': ['通用桥式起重机', '防爆桥式起重机', '绝缘桥式起重机', '冶金桥式起重机', '电动单梁起重机', '电动葫芦桥式起重机'],
  '流动式': ['轮胎起重机', '履带起重机', '集装箱正面吊运起重机', '铁路起重机'],
  '门式': ['通用门式起重机', '防爆门式起重机', '轨道式集装箱门式起重机', '轮胎式集装箱门式起重机', '岸边集装箱起重机', '造船门式起重机', '电动葫芦门式起重机', '装卸桥', '架桥机'],
  '门座': ['门座起重机', '固定式起重机'],
  '缆索式': ['缆索式起重机'],
  '桅杆式': ['桅杆式起重机'],
  '升降机': ['施工升降机', '简易升降机', '升降机'],
  '施工升降机': ['齿轮齿条式', '钢丝绳式', '混合式'],
  '标准节': ['标准节', '基础节', '加强节'],
};

// --- Mock Data ---

const MOCK_PRODUCTS: Product[] = [
  { id: '1', code: 'P20240301001', name: '高性能混凝土', category: '建材', specification: 'C30', brand: '中建', batchNumber: '20240301-01', status: '审核通过' },
  { id: '2', code: '--', name: '节能玻璃', category: '装饰材料', specification: '6+12A+6', brand: '南玻', batchNumber: '20240301-02', status: '待审核' },
  { id: '3', code: '--', name: '环保涂料', category: '化工', specification: '20L/桶', brand: '立邦', batchNumber: '20240301-03', status: '编辑中' },
  { id: '4', code: '--', name: '再生骨料', category: '建材', specification: '5-20mm', brand: '迎建', batchNumber: '20240301-04', status: '审核不通过' },
  { id: '5', code: 'P20240301005', name: '智能温控器', category: '机电设备', specification: 'TH-01', brand: '霍尼韦尔', batchNumber: '20240301-05', status: '审核通过' },
  { id: '6', code: '--', name: '隔热材料', category: '建材', specification: '50mm', brand: '欧文斯科宁', batchNumber: '20240301-06', status: '待审核' },
  { id: '7', code: '--', name: '防水卷材', category: '建材', specification: '3mm', brand: '东方雨虹', batchNumber: '20240301-07', status: '编辑中' },
  { id: '8', code: '--', name: '防火涂料', category: '化工', specification: '15kg/桶', brand: '汇泰', batchNumber: '20240301-08', status: '审核不通过' },
  { id: '9', code: 'P20240301009', name: 'LED照明灯', category: '机电设备', specification: '50W', brand: '飞利浦', batchNumber: '20240301-09', status: '审核通过' },
  { id: '10', code: '--', name: '隔音棉', category: '建材', specification: '25mm', brand: '泰山', batchNumber: '20240301-10', status: '待审核' },
  { id: '11', code: '--', name: '钢筋', category: '建材', specification: 'Φ12', brand: '沙钢', batchNumber: '20240301-11', status: '编辑中' },
  { id: '12', code: '--', name: '木方', category: '建材', specification: '40*90', brand: '大自然', batchNumber: '20240301-12', status: '待审核' },
];

const MOCK_EQUIPMENTS: Equipment[] = [
  { id: 'e1', factoryNo: 'SN-TC-001', variety: '平头式塔式起重机', category: '塔式起重机', model: 'QTZ80', code: 'EQ-TC-001', factoryDate: '2023-12-15', status: '审核通过' },
  { id: 'e2', factoryNo: 'SN-TC-002', variety: '动臂式塔式起重机', category: '塔式起重机', model: 'QTZ125', code: 'EQ-TC-002', factoryDate: '2024-01-10', status: '待审核' },
  { id: 'e3', factoryNo: 'SN-TC-003', variety: '平头式塔式起重机', category: '塔式起重机', model: 'QTZ63', code: 'EQ-TC-003', factoryDate: '2024-02-05', status: '编辑中' },
  { id: 'e4', factoryNo: 'SN-TC-004', variety: '平头式塔式起重机', category: '塔式起重机', model: 'QTZ100', code: 'EQ-TC-004', factoryDate: '2024-02-20', status: '审核不通过' },
  { id: 'e5', factoryNo: 'SN-TC-005', variety: '动臂式塔式起重机', category: '塔式起重机', model: 'QTZ160', code: 'EQ-TC-005', factoryDate: '2023-11-30', status: '审核通过' },
  { id: 'e6', factoryNo: 'SN-CL-001', variety: '齿轮齿条式', category: '施工升降机', model: 'SC200/200', code: 'EQ-CL-001', factoryDate: '2024-01-15', status: '审核通过' },
  { id: 'e7', factoryNo: 'SN-CL-002', variety: '钢丝绳式', category: '施工升降机', model: 'SS100/100', code: 'EQ-CL-002', factoryDate: '2024-02-10', status: '待审核' },
  { id: 'e8', factoryNo: 'SN-CL-003', variety: '混合式', category: '施工升降机', model: 'SC120', code: 'EQ-CL-003', factoryDate: '2024-02-15', status: '编辑中' },
  { id: 'e9', factoryNo: 'SN-CL-004', variety: '齿轮齿条式', category: '施工升降机', model: 'SC200', code: 'EQ-CL-004', factoryDate: '2024-02-25', status: '审核不通过' },
  { id: 'e11', factoryNo: 'SN-CL-005', variety: '钢丝绳式', category: '施工升降机', model: 'SSD80', code: 'EQ-CL-005', factoryDate: '2024-03-01', status: '审核通过' },
  { id: 'e12', factoryNo: 'SN-CL-006', variety: '混合式', category: '施工升降机', model: 'SC150/150', code: 'EQ-CL-006', factoryDate: '2024-03-05', status: '待审核' },
  { id: 'e10', factoryNo: 'SN-S001', variety: '标准节', category: '标准节', model: 'S-650', code: 'SP-2024-001', factoryDate: '2024-03-10', status: '审核通过', mainMachineNo: 'EQ-TC-001', manufacturer: '中联重科', standardPartArchives: [{ variety: '标准节', factoryNo: 'SN-S001', factoryDate: '2024-03-10' }, { variety: '加强节', factoryNo: 'SN-S001-A', factoryDate: '2024-03-10' }] },
  { id: 'e13', factoryNo: 'SN-S002', variety: '基础节', category: '标准节', model: 'J-800', code: 'SP-2024-002', factoryDate: '2024-03-12', status: '编辑中', mainMachineNo: 'EQ-TC-002', manufacturer: '徐工集团', standardPartArchives: [{ variety: '基础节', factoryNo: 'SN-S002', factoryDate: '2024-03-12' }] },
  { id: 'e14', factoryNo: 'SN-S003', variety: '加强节', category: '标准节', model: 'S-700', code: 'SP-2024-003', factoryDate: '2024-03-15', status: '待审核', mainMachineNo: 'EQ-TC-003', manufacturer: '三一重工', standardPartArchives: [{ variety: '加强节', factoryNo: 'SN-S003', factoryDate: '2024-03-15' }, { variety: '标准节', factoryNo: 'SN-S003-B', factoryDate: '2024-03-15' }, { variety: '标准节', factoryNo: 'SN-S003-C', factoryDate: '2024-03-15' }] },
  { id: 'e15', factoryNo: 'SN-S004', variety: '标准节', category: '标准节', model: 'S-600', code: 'SP-2024-004', factoryDate: '2024-03-18', status: '审核不通过', mainMachineNo: 'EQ-TC-004', manufacturer: '中联重科', standardPartArchives: [{ variety: '标准节', factoryNo: 'SN-S004', factoryDate: '2024-03-18' }] },
];

// --- Components ---

const StatusBadge = ({ status }: { status: ProductStatus }) => {
  const styles = {
    '编辑中': 'bg-gray-100 text-gray-600',
    '待审核': 'bg-blue-50 text-blue-600',
    '审核通过': 'bg-green-50 text-green-600',
    '审核不通过': 'bg-red-50 text-red-600',
    '全部': '',
  };

  const dotColors = {
    '编辑中': 'bg-gray-400',
    '待审核': 'bg-blue-400',
    '审核通过': 'bg-green-400',
    '审核不通过': 'bg-red-400',
    '全部': '',
  };

  if (status === '全部') return null;

  const label = status === '审核通过' ? '通过' : status;

  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
      status === '编辑中' ? 'bg-gray-50 border-gray-200 text-gray-600' :
      status === '待审核' ? 'bg-blue-50 border-blue-100 text-blue-600' :
      status === '审核通过' ? 'bg-green-50 border-green-100 text-green-600' :
      'bg-red-50 border-red-100 text-red-600'
    }`}>
      <span className={`w-1 h-1 rounded-full mr-1.5 ${dotColors[status]}`}></span>
      {label}
    </div>
  );
};

const ArchiveDisplay = ({ archives }: { archives?: StandardPartArchive[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!archives || archives.length === 0) return <span className="text-gray-400">--</span>;
  
  const formatNo = (archive: StandardPartArchive) => {
    return `${archive.variety}（${archive.factoryNo}${archive.factoryDate ? `|${archive.factoryDate}` : ''}）`;
  };

  if (archives.length === 1) {
    return <span className="text-gray-600">{formatNo(archives[0])}</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">{formatNo(archives[0])}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-[#005a32] text-xs hover:underline flex items-center gap-0.5"
        >
          {isExpanded ? '收起' : `更多(${archives.length - 1})`}
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      {isExpanded && (
        <div className="flex flex-col gap-1 pl-2 border-l-2 border-gray-100 mt-1">
          {archives.slice(1).map((archive, idx) => (
            <span key={idx} className="text-gray-500 text-xs">
              {formatNo(archive)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const EnterpriseRegistration = ({ formData, setFormData, onReset, onSubmit }: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev: any) => ({ ...prev, [field]: e.target.files![0].name }));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Title and Buttons */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">企业信息登记</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSubmit('提交')}
              className="bg-[#005a32] text-white px-6 py-2 rounded font-medium hover:bg-[#004d2c] transition-colors shadow-sm flex items-center gap-2"
            >
              <Zap size={18} />
              提交审核
            </button>
            <button 
              onClick={() => onSubmit('修改')}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <Edit3 size={18} />
              修改保存
            </button>
            <button 
              onClick={onReset}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <RefreshCw size={18} />
              重置
            </button>
          </div>
        </div>
      </div>

      {/* Submission Notes Alert Box */}
      <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-8 flex gap-3">
        <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5 font-bold">!</div>
        <div className="text-sm text-orange-800 space-y-1">
          <p className="font-bold">提交须知：</p>
          <p>1. 提交后将在1~3个工作日内完成审核。</p>
          <p>2. 请确保所提供的信息真实有效，如有虚假将影响您的企业信誉。</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section: Enterprise Registration Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">企业信息</h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>当前状态：</span>
                <span className={`px-2 py-0.5 rounded font-medium ${
                  formData.status === '审核通过' ? 'bg-green-500 text-white' :
                  formData.status === '审核中' ? 'bg-blue-500 text-white' :
                  formData.status === '审核不通过' ? 'bg-red-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>{formData.status}</span>
              </div>
              {formData.status === '审核通过' && (
                <span className="text-xs text-gray-400">有效期至:2029年3月30日</span>
              )}
            </div>
          </div>
          <div className="p-8 space-y-12">
            {/* Basic Info Sub-section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">企业名称 <span className="text-red-500">*</span></label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                  placeholder="请输入企业全称"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">法定代表人 <span className="text-red-500">*</span></label>
                <input 
                  name="legalRep"
                  value={formData.legalRep}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                  placeholder="请输入法定代表人姓名"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">统一社会信用代码 <span className="text-red-500">*</span></label>
                <input 
                  name="creditCode"
                  value={formData.creditCode}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                  placeholder="18位统一社会信用代码"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">注册资本 <span className="text-red-500">*</span></label>
                <div className="flex-1 relative">
                  <input 
                    name="capital"
                    value={formData.capital}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                    placeholder="请输入注册资本"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">万元</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">注册地址 <span className="text-red-500">*</span></label>
                <input 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                  placeholder="请输入企业注册地址"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">成立时间 <span className="text-red-500">*</span></label>
                <input 
                  name="establishDate"
                  type="date"
                  value={formData.establishDate}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">申请人 <span className="text-red-500">*</span></label>
                <input 
                  name="applicant"
                  value={formData.applicant}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                  placeholder="请输入申请人姓名"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">联系方式 <span className="text-red-500">*</span></label>
                <input 
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                  placeholder="请输入联系电话"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">特种设备生产许可证编号 <span className="text-red-500">*</span></label>
                <input 
                  name="specialLicenseNo"
                  value={formData.specialLicenseNo}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                  placeholder="请输入许可证编号"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right shrink-0">特种设备生产许可证有效期至 <span className="text-red-500">*</span></label>
                <input 
                  name="specialLicenseExpiry"
                  type="date"
                  value={formData.specialLicenseExpiry}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                />
              </div>
              <div className="col-span-2 flex items-start gap-4">
                <label className="w-32 text-sm text-gray-600 text-right pt-2 shrink-0">经营范围 <span className="text-red-500">*</span></label>
                <textarea 
                  name="businessScope"
                  value={formData.businessScope}
                  onChange={handleChange}
                  rows={3}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32] resize-none"
                  placeholder="请输入企业经营范围"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-8">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <label className="w-32 text-sm text-gray-600 text-right pt-2 shrink-0">企业营业执照 <span className="text-red-500">*</span></label>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all group">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#005a32]" />
                        <span className="text-[10px] text-gray-500">上传执照</span>
                        <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'license')} />
                      </label>
                      {formData.license && (
                        <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between h-24">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{formData.license}</p>
                              <p className="text-xs text-gray-400">已选择文件</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setFormData((prev: any) => ({ ...prev, license: '' }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">支持pdf、jpg、png格式，文件大小不超过10MB</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <label className="w-32 text-sm text-gray-600 text-right pt-2 shrink-0">特种设备生产许可证 <span className="text-red-500">*</span></label>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all group">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#005a32]" />
                        <span className="text-[10px] text-gray-500">上传许可证</span>
                        <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'specialLicense')} />
                      </label>
                      {formData.specialLicense && (
                        <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between h-24">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{formData.specialLicense}</p>
                              <p className="text-xs text-gray-400">已选择文件</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setFormData((prev: any) => ({ ...prev, specialLicense: '' }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">支持pdf、jpg、png格式，文件大小不超过10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentMenu, setCurrentMenu] = useState<MenuType>('crane');
  const [isEqMenuOpen, setIsEqMenuOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<ProductStatus>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Product Filters
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [batchQuery, setBatchQuery] = useState('');
  
  // Equipment Filters
  const [selectedEqCategory, setSelectedEqCategory] = useState('全部');
  const [selectedVariety, setSelectedVariety] = useState('全部');
  const [factoryNoQuery, setFactoryNoQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [isPreview, setIsPreview] = useState(false);
  const [section1Open, setSection1Open] = useState(true);
  const [enterpriseSectionOpen, setEnterpriseSectionOpen] = useState(true);
  const [section2Open, setSection2Open] = useState(true);

  const [standardSections, setStandardSections] = useState<any[]>([]);
  const [selectedStandardSections, setSelectedStandardSections] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showStandardPartModal, setShowStandardPartModal] = useState(false);
  const [showBindingConfirmModal, setShowBindingConfirmModal] = useState(false);
  const [showJibModal, setShowJibModal] = useState(false);
  const [showDefaultInfoModal, setShowDefaultInfoModal] = useState(false);
  const [showNoDefaultInfoModal, setShowNoDefaultInfoModal] = useState(false);
  const [showMachineSelectModal, setShowMachineSelectModal] = useState(false);
  const [defaultInfoData, setDefaultInfoData] = useState({
    enterpriseName: '',
    address: '',
    creditCode: '',
    reporter: '',
    contactInfo: ''
  });
  const [editingStandardPartIndex, setEditingStandardPartIndex] = useState<number | null>(null);
  const [standardPartModalData, setStandardPartModalData] = useState({
    mainMachineNo: '',
    factoryCode: '',
    productionDate: '',
    type: '标准节',
    photo: '',
    history: ''
  });
  const [jibModalType, setJibModalType] = useState<'jib' | 'counterJib' | 'slewing' | 'cage' | 'safetyDevice' | 'driveUnit'>('jib');
  const [editingJibIndex, setEditingJibIndex] = useState<number | null>(null);
  const [jibModalData, setJibModalData] = useState({ code: '', date: '', direction: '左', component: '电动机', photo: '' });
  const [selectedJibIndices, setSelectedJibIndices] = useState<number[]>([]);
  const [selectedCounterJibIndices, setSelectedCounterJibIndices] = useState<number[]>([]);
  const [selectedSlewingIndices, setSelectedSlewingIndices] = useState<number[]>([]);
  const [selectedCageIndices, setSelectedCageIndices] = useState<number[]>([]);
  const [selectedSafetyDeviceIndices, setSelectedSafetyDeviceIndices] = useState<number[]>([]);
  const [selectedDriveUnitIndices, setSelectedDriveUnitIndices] = useState<number[]>([]);

  const handleAddJib = () => {
    const sectionKey = 
      jibModalType === 'jib' ? 'jibSections' : 
      jibModalType === 'counterJib' ? 'counterJibSections' : 
      jibModalType === 'slewing' ? 'slewingMechanismSections' : 
      jibModalType === 'cage' ? 'cageSections' :
      jibModalType === 'driveUnit' ? 'driveUnitSections' :
      'safetyDeviceSections';
    if (editingJibIndex !== null) {
      const newSections = [...(equipmentFormData as any)[sectionKey]];
      newSections[editingJibIndex] = { ...jibModalData, id: newSections[editingJibIndex].id };
      setEquipmentFormData({ ...equipmentFormData, [sectionKey]: newSections });
    } else {
      const newSection = {
        id: Math.random().toString(36).substr(2, 9),
        ...jibModalData
      };
      setEquipmentFormData({
        ...equipmentFormData,
        [sectionKey]: [...(equipmentFormData as any)[sectionKey], newSection]
      });
    }
    setShowJibModal(false);
    setEditingJibIndex(null);
    setJibModalData({ code: '', date: '', direction: '左', component: '电动机', photo: '' });
  };

  const handleDeleteJib = (type: 'jib' | 'counterJib' | 'slewing' | 'cage' | 'safetyDevice' | 'driveUnit', index: number) => {
    const sectionKey = 
      type === 'jib' ? 'jibSections' : 
      type === 'counterJib' ? 'counterJibSections' : 
      type === 'slewing' ? 'slewingMechanismSections' : 
      type === 'cage' ? 'cageSections' :
      type === 'driveUnit' ? 'driveUnitSections' :
      'safetyDeviceSections';
    const setSelection = 
      type === 'jib' ? setSelectedJibIndices : 
      type === 'counterJib' ? setSelectedCounterJibIndices : 
      type === 'slewing' ? setSelectedSlewingIndices : 
      type === 'cage' ? setSelectedCageIndices :
      type === 'driveUnit' ? setSelectedDriveUnitIndices :
      setSelectedSafetyDeviceIndices;
    const currentSelection = 
      type === 'jib' ? selectedJibIndices : 
      type === 'counterJib' ? selectedCounterJibIndices : 
      type === 'slewing' ? selectedSlewingIndices : 
      type === 'cage' ? selectedCageIndices :
      type === 'driveUnit' ? selectedDriveUnitIndices :
      selectedSafetyDeviceIndices;

    const newSections = (equipmentFormData as any)[sectionKey].filter((_: any, i: number) => i !== index);
    setEquipmentFormData({ ...equipmentFormData, [sectionKey]: newSections });
    setSelection(currentSelection.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const handleBatchDeleteJib = (type: 'jib' | 'counterJib' | 'slewing' | 'cage' | 'safetyDevice' | 'driveUnit') => {
    const sectionKey = 
      type === 'jib' ? 'jibSections' : 
      type === 'counterJib' ? 'counterJibSections' : 
      type === 'slewing' ? 'slewingMechanismSections' : 
      type === 'cage' ? 'cageSections' :
      type === 'driveUnit' ? 'driveUnitSections' :
      'safetyDeviceSections';
    const setSelection = 
      type === 'jib' ? setSelectedJibIndices : 
      type === 'counterJib' ? setSelectedCounterJibIndices : 
      type === 'slewing' ? setSelectedSlewingIndices : 
      type === 'cage' ? setSelectedCageIndices :
      type === 'driveUnit' ? setSelectedDriveUnitIndices :
      setSelectedSafetyDeviceIndices;
    const currentSelection = 
      type === 'jib' ? selectedJibIndices : 
      type === 'counterJib' ? selectedCounterJibIndices : 
      type === 'slewing' ? selectedSlewingIndices : 
      type === 'cage' ? selectedCageIndices :
      type === 'driveUnit' ? selectedDriveUnitIndices :
      selectedSafetyDeviceIndices;

    const newSections = (equipmentFormData as any)[sectionKey].filter((_: any, i: number) => !currentSelection.includes(i));
    setEquipmentFormData({ ...equipmentFormData, [sectionKey]: newSections });
    setSelection([]);
  };

  const handleSaveStandardPart = (force = false) => {
    const existingSection = standardSections.find((s, idx) => 
      s.factoryCode === standardPartModalData.factoryCode && 
      (editingStandardPartIndex === null || idx !== editingStandardPartIndex)
    );

    let updatedData = { ...standardPartModalData };

    if (!force && existingSection && existingSection.mainMachineNo && existingSection.mainMachineNo !== standardPartModalData.mainMachineNo) {
      setShowBindingConfirmModal(true);
      return;
    }

    if (editingStandardPartIndex !== null) {
      const oldRecord = standardSections[editingStandardPartIndex];
      if (oldRecord.mainMachineNo && oldRecord.mainMachineNo !== standardPartModalData.mainMachineNo) {
        const currentHistory = oldRecord.history || '';
        updatedData.history = currentHistory ? `${currentHistory}, ${oldRecord.mainMachineNo}` : oldRecord.mainMachineNo;
      }
      
      const newSections = [...standardSections];
      newSections[editingStandardPartIndex] = { 
        ...oldRecord,
        ...updatedData
      };
      setStandardSections(newSections);
    } else {
      if (existingSection && existingSection.mainMachineNo && existingSection.mainMachineNo !== standardPartModalData.mainMachineNo) {
        const existingIdx = standardSections.findIndex(s => s.factoryCode === standardPartModalData.factoryCode);
        const oldRecord = standardSections[existingIdx];
        const currentHistory = oldRecord.history || '';
        updatedData.history = currentHistory ? `${currentHistory}, ${oldRecord.mainMachineNo}` : oldRecord.mainMachineNo;
        
        const newSections = [...standardSections];
        newSections[existingIdx] = { 
          ...oldRecord,
          ...updatedData
        };
        setStandardSections(newSections);
      } else {
        setStandardSections([...standardSections, { 
          id: Date.now().toString(), 
          ...updatedData 
        }]);
      }
    }
    setShowStandardPartModal(false);
    setShowBindingConfirmModal(false);
  };

  const handleAddNew = () => {
    if (currentMenu === 'product') {
      setProductFormData({
        name: '',
        cat1: '',
        cat2: '',
        spec: '',
        brand: '',
        batch: '',
        intro: ''
      });
    } else {
      setStandardSections([]);
      setSelectedStandardSections([]);
      setEquipmentFormData({
        mainMachineNo: '',
        enterpriseName: '',
        creditCode: '',
        reporter: '',
        contactInfo: '',
        manufacturer: '',
        address: '',
        licenseNo: '',
        category: currentMenu === 'lift' ? '施工升降机' : currentMenu === 'standard_part' ? '标准节' : '塔式起重机',
        variety: currentMenu === 'lift' ? '齿轮齿条式' : currentMenu === 'standard_part' ? '标准节' : '平头式塔式起重机',
        factoryNo: '',
        factoryDate: '',
        testCertNo: '',
        licensePhoto: '',
        factoryCertPhoto: '',
        testReportPhoto: '',
        // 主机档案信息
        jibSections: [],
        counterJibSections: [],
        slewingMechanismSections: [],
        cageSections: [],
        safetyDeviceSections: [],
        driveUnitSections: [],
        jibSectionCode: '',
        jibSectionDate: '',
        jibSectionPhoto: '',
        counterJibSectionCode: '',
        counterJibSectionDate: '',
        counterJibSectionPhoto: '',
        upperSupportCode: '',
        upperSupportDate: '',
        upperSupportPhoto: '',
        lowerSupportCode: '',
        lowerSupportDate: '',
        lowerSupportPhoto: '',
        transitionSectionCode: '',
        transitionSectionDate: '',
        transitionSectionPhoto: '',
        climbingFrameCode: '',
        climbingFrameDate: '',
        climbingFramePhoto: '',
        slewingMechanismCode: '',
        slewingMechanismDate: '',
        slewingMechanismPhoto: '',
        hoistingMechanismCode: '',
        hoistingMechanismDate: '',
        hoistingMechanismPhoto: '',
        luffingMechanismCode: '',
        luffingMechanismDate: '',
        luffingMechanismPhoto: '',
        slewingBearingCode: '',
        slewingBearingDate: '',
        slewingBearingPhoto: '',
        towerTopCode: '',
        towerTopDate: '',
        towerTopPhoto: '',
        trolleyCode: '',
        trolleyDate: '',
        trolleyPhoto: '',
        hookCode: '',
        hookDate: '',
        hookPhoto: '',
        outriggerCode: '',
        outriggerDate: '',
        outriggerPhoto: '',
        // 升降机组件
        cageCode: '', cageDate: '', cagePhoto: '',
        driveUnitCode: '', driveUnitDate: '', driveUnitPhoto: '',
        mastSectionCode: '', mastSectionDate: '', mastSectionPhoto: '',
        wallAttachmentCode: '', wallAttachmentDate: '', wallAttachmentPhoto: '',
        safetyDeviceCode: '', safetyDeviceDate: '', safetyDevicePhoto: '',
        cableGuideCode: '', cableGuideDate: '', cableGuidePhoto: '',
        foundationCode: '', foundationDate: '', foundationPhoto: '',
        fenceCode: '', fenceDate: '', fencePhoto: '',
      });
    }
    setView('form');
  };

  // Form State (Mock)
  const [productFormData, setProductFormData] = useState({
    name: '',
    cat1: '',
    cat2: '',
    spec: '',
    brand: '',
    batch: '',
    intro: ''
  });

  const [equipmentFormData, setEquipmentFormData] = useState({
    mainMachineNo: '',
    enterpriseName: '',
    creditCode: '',
    reporter: '',
    contactInfo: '',
    manufacturer: '',
    address: '',
    licenseNo: '',
    category: '塔式起重机',
    variety: '平头式塔式起重机',
    factoryNo: '',
    factoryDate: '',
    testCertNo: '',
    licensePhoto: '',
    factoryCertPhoto: '',
    testReportPhoto: '',
    // 主机档案信息
    jibSections: [] as { id: string, code: string, date: string }[],
    counterJibSections: [] as { id: string, code: string, date: string }[],
    slewingMechanismSections: [] as { id: string, code: string, date: string }[],
    cageSections: [] as { id: string, code: string, date: string, direction: string }[],
    safetyDeviceSections: [] as { id: string, code: string, date: string, direction: string }[],
    driveUnitSections: [] as { id: string, code: string, date: string, component: string }[],
    jibSectionCode: '',
    jibSectionDate: '',
    jibSectionPhoto: '',
    counterJibSectionCode: '',
    counterJibSectionDate: '',
    counterJibSectionPhoto: '',
    upperSupportCode: '',
    upperSupportDate: '',
    upperSupportPhoto: '',
    lowerSupportCode: '',
    lowerSupportDate: '',
    lowerSupportPhoto: '',
    transitionSectionCode: '',
    transitionSectionDate: '',
    transitionSectionPhoto: '',
    climbingFrameCode: '',
    climbingFrameDate: '',
    climbingFramePhoto: '',
    slewingMechanismCode: '',
    slewingMechanismDate: '',
    slewingMechanismPhoto: '',
    hoistingMechanismCode: '',
    hoistingMechanismDate: '',
    hoistingMechanismPhoto: '',
    luffingMechanismCode: '',
    luffingMechanismDate: '',
    luffingMechanismPhoto: '',
    slewingBearingCode: '',
    slewingBearingDate: '',
    slewingBearingPhoto: '',
    towerTopCode: '',
    towerTopDate: '',
    towerTopPhoto: '',
    trolleyCode: '',
    trolleyDate: '',
    trolleyPhoto: '',
    hookCode: '',
    hookDate: '',
    hookPhoto: '',
    outriggerCode: '',
    outriggerDate: '',
    outriggerPhoto: '',
    // 升降机组件
    cageCode: '', cageDate: '', cagePhoto: '',
    driveUnitCode: '', driveUnitDate: '', driveUnitPhoto: '',
    mastSectionCode: '', mastSectionDate: '', mastSectionPhoto: '',
    wallAttachmentCode: '', wallAttachmentDate: '', wallAttachmentPhoto: '',
    safetyDeviceCode: '', safetyDeviceDate: '', safetyDevicePhoto: '',
    cableGuideCode: '', cableGuideDate: '', cableGuidePhoto: '',
    foundationCode: '', foundationDate: '', foundationPhoto: '',
    fenceCode: '', fenceDate: '', fencePhoto: '',
  });

  const [enterpriseFormData, setEnterpriseFormData] = useState({
    name: '广州华工设备有限公司',
    legalRep: '张三',
    creditCode: '91440101MA59XXXXXX',
    capital: '5000',
    address: '广州市天河区五山路381号',
    establishDate: '2010-05-20',
    businessScope: '建筑工程机械设备制造、销售、租赁、维修及技术咨询服务。',
    applicant: '李四',
    contact: '13800138000',
    specialLicenseNo: 'TS2210XXXX-2028',
    specialLicenseExpiry: '2028-12-31',
    license: 'business_license_v1.pdf',
    specialLicense: 'special_equipment_license.pdf',
    status: '待提交'
  });

  const handleEnterpriseSubmit = (type: string) => {
    if (type === '提交') {
      setEnterpriseFormData(prev => ({ ...prev, status: '审核通过' }));
    }
  };

  const handleEnterpriseReset = () => {
    setEnterpriseFormData({
      name: '',
      legalRep: '',
      creditCode: '',
      capital: '',
      address: '',
      establishDate: '',
      businessScope: '',
      applicant: '',
      contact: '',
      specialLicenseNo: '',
      specialLicenseExpiry: '',
      license: '',
      specialLicense: '',
      status: '待提交'
    });
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesStatus = activeTab === '全部' || p.status === activeTab;
      const matchesSearch = p.name.includes(searchQuery) || p.brand.includes(searchQuery);
      const matchesCategory = selectedCategory === '全部' || p.category === selectedCategory;
      const matchesBatch = p.batchNumber.includes(batchQuery);
      return matchesStatus && matchesSearch && matchesCategory && matchesBatch;
    });
  }, [activeTab, searchQuery, selectedCategory, batchQuery]);

  const filteredEquipments = useMemo(() => {
    return MOCK_EQUIPMENTS.filter(e => {
      const matchesMenu = 
        currentMenu === 'crane' ? (e.category !== '施工升降机' && e.category !== '标准节') : 
        currentMenu === 'lift' ? e.category === '施工升降机' : 
        currentMenu === 'standard_part' ? e.category === '标准节' :
        false;
      const matchesStatus = activeTab === '全部' || e.status === activeTab;
      // Fuzzy search: factoryNo, code, and mainMachineNo
      const matchesSearch = e.factoryNo.includes(searchQuery) || 
                           (e.code && e.code.includes(searchQuery)) ||
                           (currentMenu === 'standard_part' && e.mainMachineNo && e.mainMachineNo.includes(searchQuery));
      const matchesCategory = selectedEqCategory === '全部' || e.category === selectedEqCategory;
      const matchesVariety = selectedVariety === '全部' || e.variety === selectedVariety;
      const matchesModel = e.model.includes(modelQuery);
      
      // Date range
      let matchesDate = true;
      if (startDate && endDate) {
        matchesDate = e.factoryDate >= startDate && e.factoryDate <= endDate;
      } else if (startDate) {
        matchesDate = e.factoryDate >= startDate;
      } else if (endDate) {
        matchesDate = e.factoryDate <= endDate;
      }

      return matchesMenu && matchesStatus && matchesSearch && matchesCategory && matchesVariety && matchesModel && matchesDate;
    });
  }, [currentMenu, activeTab, searchQuery, selectedEqCategory, selectedVariety, modelQuery, startDate, endDate]);

  const handleMenuChange = (menu: MenuType) => {
    setCurrentMenu(menu);
    setActiveTab('全部');
    setSearchQuery('');
    setShowAdvanced(false);
    setView('list');
    // Reset filters
    setSelectedCategory('全部');
    setBatchQuery('');
    setSelectedEqCategory('全部');
    setSelectedVariety('全部');
    setFactoryNoQuery('');
    setModelQuery('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col font-sans text-gray-800">
      {/* Top Header */}
      <header className="bg-[#005a32] text-white h-14 flex items-center justify-between px-6 shadow-md z-20">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-bold tracking-tight">广州市绿色建材交易平台</h1>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium opacity-90">
            <a href="#" className="hover:opacity-100 transition-opacity">商机管理</a>
            <a href="#" className="hover:opacity-100 transition-opacity">合同管理</a>
            <a href="#" className="hover:opacity-100 transition-opacity">订单管理</a>
            <a href="#" className="hover:opacity-100 transition-opacity">商品管理</a>
            <a href="#" className="border-b-2 border-white pb-1 opacity-100">进场服务管理</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#005a32]"></span>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-white/20">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
            <span className="text-sm font-medium">企业A</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col z-10">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">进场服务管理</span>
            <MoreHorizontal size={16} className="text-gray-400" />
          </div>
          <nav className="flex-1 py-4">
            <div className="px-3 mb-2">
              <button 
                onClick={() => handleMenuChange('enterprise_reg')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentMenu === 'enterprise_reg' 
                    ? 'bg-[#005a32]/10 text-[#005a32]' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 size={20} />
                <span>企业信息登记</span>
              </button>
            </div>

            <div className="px-3 mb-2">
              <button 
                onClick={() => handleMenuChange('crane')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentMenu === 'crane' 
                    ? 'bg-[#005a32]/10 text-[#005a32]' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard size={20} />
                <span>起重机设备入库</span>
              </button>
            </div>

            <div className="px-3 mb-2">
              <button 
                onClick={() => handleMenuChange('lift')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentMenu === 'lift' 
                    ? 'bg-[#005a32]/10 text-[#005a32]' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard size={20} />
                <span>升降机设备入库</span>
              </button>
            </div>

            <div className="px-3 mb-2">
              <button 
                onClick={() => handleMenuChange('standard_part')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentMenu === 'standard_part' 
                    ? 'bg-[#005a32]/10 text-[#005a32]' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package size={20} />
                <span>标准节入库</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f4f7f6]">
          {currentMenu === 'enterprise_reg' ? (
            <EnterpriseRegistration 
              formData={enterpriseFormData}
              setFormData={setEnterpriseFormData}
              onReset={handleEnterpriseReset}
              onSubmit={handleEnterpriseSubmit}
            />
          ) : view === 'list' ? (
            <div className="p-6 max-w-7xl mx-auto">
              {/* Page Title & Breadcrumb */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentMenu === 'product' ? '产品入库' : currentMenu === 'crane' ? '起重机设备入库' : currentMenu === 'lift' ? '升降机设备入库' : '标准节入库'}
                </h2>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#005a32]">
                  <RefreshCw size={14} />
                  刷新
                </button>
              </div>

              {/* List Container */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-[#005a32] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#004d2c] transition-colors shadow-sm"
                      >
                        <Plus size={18} />
                        {currentMenu === 'product' ? '新增产品入库' : currentMenu === 'crane' ? '新增起重机设备入库' : currentMenu === 'lift' ? '新增升降机设备入库' : '新增标准节入库'}
                      </button>
                      <button 
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <Upload size={18} />
                        批量导入
                      </button>
                    </div>

                    {/* Status Filter (Radio Style) */}
                    <div className="flex items-center gap-6">
                      {(['编辑中', '待审核', '审核通过', '全部', '审核不通过'] as ProductStatus[]).map((status) => (
                        <label 
                          key={status}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              name="statusFilter"
                              className="sr-only"
                              checked={activeTab === status}
                              onChange={() => setActiveTab(status)}
                            />
                            <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                              activeTab === status 
                                ? 'border-[#005a32] bg-white' 
                                : 'border-gray-300 bg-white group-hover:border-gray-400'
                            }`}>
                              {activeTab === status && (
                                <div className="w-2 h-2 rounded-full bg-[#005a32]" />
                              )}
                            </div>
                          </div>
                          <span className={`text-sm transition-colors ${
                            activeTab === status ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-700'
                          }`}>
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder={currentMenu === 'product' ? "搜索产品名称、品牌..." : currentMenu === 'standard_part' ? "搜索主机编号、标准节编号" : "搜索主机编号..."}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                        showAdvanced ? 'bg-[#f0f9f4] border-[#005a32] text-[#005a32]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Filter size={16} />
                      高级搜索
                      {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button className="bg-[#005a32] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#004d2c] transition-colors">
                      搜索
                    </button>
                  </div>

                  {/* Advanced Search Panel */}
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 mt-6 border-t border-gray-100">
                          {currentMenu === 'product' ? (
                            <>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">产品类别</label>
                                <select 
                                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                                  value={selectedCategory}
                                  onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                  <option value="全部">全部</option>
                                  <option value="建材">建材</option>
                                  <option value="装饰材料">装饰材料</option>
                                  <option value="化工">化工</option>
                                  <option value="机电设备">机电设备</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">生产批次 (炉批号)</label>
                                <input 
                                  type="text" 
                                  placeholder="请输入生产批次"
                                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                                  value={batchQuery}
                                  onChange={(e) => setBatchQuery(e.target.value)}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              {currentMenu === 'standard_part' ? (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">类型</label>
                                  <select 
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                                    value={selectedVariety}
                                    onChange={(e) => setSelectedVariety(e.target.value)}
                                  >
                                    <option value="全部">全部</option>
                                    {EQUIPMENT_HIERARCHY['标准节'].map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">设备品种</label>
                                    <select 
                                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                                      value={selectedVariety}
                                      onChange={(e) => setSelectedVariety(e.target.value)}
                                    >
                                      <option value="全部">全部</option>
                                      {Object.entries(EQUIPMENT_HIERARCHY)
                                        .filter(([cat]) => 
                                          currentMenu === 'lift' ? cat === '升降机' : 
                                          (cat !== '升降机' && cat !== '标准节')
                                        )
                                        .flatMap(([_, varieties]) => varieties)
                                        .map(varItem => (
                                          <option key={varItem} value={varItem}>{varItem}</option>
                                        ))}
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">规格型号</label>
                                    <input 
                                      type="text" 
                                      placeholder="请输入规格型号"
                                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                                      value={modelQuery}
                                      onChange={(e) => setModelQuery(e.target.value)}
                                    />
                                  </div>
                                </>
                              )}
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">出厂时间</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="date" 
                                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                  />
                                  <span className="text-gray-400">-</span>
                                  <input 
                                    type="date" 
                                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="px-6 py-4 w-12">
                          <input type="checkbox" className="rounded border-gray-300 text-[#005a32] focus:ring-[#005a32]" />
                        </th>
                        <th className="px-4 py-4 w-12 text-center">序</th>
                        {currentMenu === 'product' ? (
                          <>
                            <th className="px-4 py-4">产品编码</th>
                            <th className="px-4 py-4">产品名称</th>
                            <th className="px-4 py-4">产品类别</th>
                            <th className="px-4 py-4">产品规格</th>
                            <th className="px-4 py-4">品牌</th>
                            <th className="px-4 py-4">生产批次 (炉批号)</th>
                          </>
                        ) : currentMenu === 'standard_part' ? (
                          <>
                            <th className="px-4 py-4">主机编号</th>
                            <th className="px-4 py-4">标准节档案（出厂编号|出厂日期）</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-4">主机编号</th>
                            <th className="px-4 py-4">设备类别</th>
                            <th className="px-4 py-4">设备品种</th>
                            <th className="px-4 py-4">型号规格</th>
                            <th className="px-4 py-4">出厂日期</th>
                          </>
                        )}
                        <th className="px-4 py-4">状态</th>
                        <th className="px-6 py-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentMenu === 'product' ? (
                        filteredProducts.length > 0 ? (
                          filteredProducts.map((product, index) => (
                            <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                              <td className="px-6 py-4">
                                <input type="checkbox" className="rounded border-gray-300 text-[#005a32] focus:ring-[#005a32]" />
                              </td>
                              <td className="px-4 py-4 text-center text-sm text-gray-500">{index + 1}</td>
                              <td className="px-4 py-4 text-sm font-mono text-gray-600">
                                {product.status === '审核通过' ? product.code : '--'}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                              <td className="px-4 py-4 text-sm text-gray-600">{product.category}</td>
                              <td className="px-4 py-4 text-sm text-gray-600">{product.specification}</td>
                              <td className="px-4 py-4 text-sm text-gray-600">{product.brand}</td>
                              <td className="px-4 py-4 text-sm text-gray-600">{product.batchNumber}</td>
                              <td className="px-4 py-4">
                                <StatusBadge status={product.status} />
                              </td>
                              <td className="px-6 py-4 text-right">
                                {(product.status === '编辑中' || product.status === '审核不通过') ? (
                                  <div className="flex items-center justify-end gap-3">
                                    <button onClick={() => setView('form')} className="text-sm font-semibold text-[#005a32] hover:underline">编辑</button>
                                    <button className="text-sm font-semibold text-red-600 hover:underline">删除</button>
                                  </div>
                                ) : (
                                  <button onClick={() => setView('detail')} className="text-sm font-semibold text-[#005a32] hover:underline">查看</button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={10} className="px-6 py-12 text-center text-gray-500 italic">暂无匹配的产品数据</td></tr>
                        )
                      ) : (
                        filteredEquipments.length > 0 ? (
                          filteredEquipments.map((equipment, index) => (
                            <tr key={equipment.id} className="hover:bg-gray-50/80 transition-colors group">
                              <td className="px-6 py-4">
                                <input type="checkbox" className="rounded border-gray-300 text-[#005a32] focus:ring-[#005a32]" />
                              </td>
                              <td className="px-4 py-4 text-center text-sm text-gray-500">{index + 1}</td>
                              {currentMenu === 'standard_part' ? (
                                <>
                                  <td className="px-4 py-4 text-sm text-gray-600">{equipment.mainMachineNo || '--'}</td>
                                  <td className="px-4 py-4 text-sm">
                                    <ArchiveDisplay archives={equipment.standardPartArchives} />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-4 py-4 text-sm font-mono text-gray-600">{equipment.factoryNo}</td>
                                  <td className="px-4 py-4 text-sm text-gray-600">{equipment.category}</td>
                                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{equipment.variety}</td>
                                  <td className="px-4 py-4 text-sm text-gray-600">{equipment.model}</td>
                                  <td className="px-4 py-4 text-sm text-gray-600">{equipment.factoryDate}</td>
                                </>
                              )}
                              <td className="px-4 py-4">
                                <StatusBadge status={equipment.status} />
                              </td>
                              <td className="px-6 py-4 text-right">
                                {(equipment.status === '编辑中' || equipment.status === '审核不通过') ? (
                                  <div className="flex items-center justify-end gap-3">
                                    <button onClick={() => setView('form')} className="text-sm font-semibold text-[#005a32] hover:underline">编辑</button>
                                    <button className="text-sm font-semibold text-red-600 hover:underline">删除</button>
                                  </div>
                                ) : (
                                  <button onClick={() => setView('detail')} className="text-sm font-semibold text-[#005a32] hover:underline">查看</button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={10} className="px-6 py-12 text-center text-gray-500 italic">暂无匹配的设备数据</td></tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>共 {currentMenu === 'product' ? filteredProducts.length : filteredEquipments.length} 条</span>
                    <select className="bg-transparent border-none focus:ring-0 text-gray-600 font-medium cursor-pointer">
                      <option>15 条/页</option>
                      <option>30 条/页</option>
                      <option>50 条/页</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30" disabled>
                      <ChevronLeft size={18} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#005a32] text-white text-sm font-medium shadow-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-sm font-medium">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-sm font-medium">3</button>
                    <span className="px-2 text-gray-400">...</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-sm font-medium">6</button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100">
                      <ChevronRight size={18} />
                    </button>
                    <div className="ml-4 flex items-center gap-2 text-sm text-gray-500">
                      <span>跳至</span>
                      <input type="text" className="w-10 h-8 text-center border border-gray-200 rounded-md focus:outline-none focus:border-[#005a32]" defaultValue="1" />
                      <span>页</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 max-w-7xl mx-auto">
              {/* Form Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentMenu === 'product' ? '新增产品入库' : currentMenu === 'crane' ? '新增起重机设备入库' : currentMenu === 'lift' ? '新增升降机设备入库' : '新增标准节入库'}
                  </h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setView('list');
                        setIsPreview(false);
                      }}
                      className="bg-[#005a32] text-white px-6 py-2 rounded font-medium hover:bg-[#004d2c] transition-colors shadow-sm"
                    >
                      提交审核
                    </button>
                    <button 
                      onClick={() => {
                        setView('list');
                        setIsPreview(false);
                      }}
                      className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      修改保存
                    </button>
                    <button 
                      onClick={() => setIsPreview(!isPreview)}
                      className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      {isPreview ? '退出预览' : '发布预览'}
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setView('list');
                    setIsPreview(false);
                  }}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#005a32] mt-1"
                >
                  <ChevronLeft size={16} />
                  返回列表
                </button>
              </div>

              {/* Alert Box */}
              {!isPreview && (
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-8 flex gap-3">
                  <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5">!</div>
                  <div className="text-sm text-orange-800 space-y-1">
                    <p className="font-bold">提交须知：</p>
                    <p>1. 提交后将在1~3个工作日内完成审核。</p>
                    <p>2. 请确保所提供的信息真实有效，如有虚假将影响您的企业信誉。</p>
                  </div>
                </div>
              )}

              {/* Form Content */}
              <div className="space-y-4">
                {/* Section 01 */}
                {(currentMenu === 'product') && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button 
                    onClick={() => setSection1Open(!section1Open)}
                    className="w-full p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[#005a32]">01</span>
                      <h3 className="text-lg font-bold text-gray-900">基本信息</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: section1Open ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={20} className="text-gray-400" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {section1Open && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8 space-y-8">
                          {(currentMenu === 'crane' || currentMenu === 'lift') && !isPreview && (
                            <div className="flex items-center gap-3 mb-4">
                              <button 
                                onClick={() => {
                                  if (!defaultInfoData.enterpriseName && !defaultInfoData.creditCode) {
                                    setShowNoDefaultInfoModal(true);
                                    return;
                                  }
                                  setEquipmentFormData({
                                    ...equipmentFormData,
                                    manufacturer: defaultInfoData.enterpriseName,
                                    enterpriseName: defaultInfoData.enterpriseName,
                                    address: defaultInfoData.address,
                                    creditCode: defaultInfoData.creditCode,
                                    reporter: defaultInfoData.reporter,
                                    contactInfo: defaultInfoData.contactInfo
                                  });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#005a32] text-white rounded text-sm hover:bg-[#004a2a] transition-colors"
                              >
                                <Zap size={16} />
                                一键填入
                              </button>
                              <button 
                                onClick={() => setShowDefaultInfoModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors"
                              >
                                <Edit3 size={16} />
                                默认信息
                              </button>
                            </div>
                          )}
                          {currentMenu === 'product' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {/* Product Code */}
                            <div className="col-span-2 flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">产品编码：</label>
                              <input 
                                type="text" 
                                disabled 
                                placeholder="无需填写，审核通过后将生成唯一产品编码，可在订单和供货单中被关联。"
                                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-400 cursor-not-allowed"
                              />
                            </div>

                            {/* Product Name */}
                            <div className="col-span-2 flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>产品名称：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{productFormData.name || '高性能混凝土'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入产品名称"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={productFormData.name}
                                  onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Product Category */}
                            <div className="col-span-2 flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>产品类别：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{productFormData.cat1} / {productFormData.cat2}</div>
                              ) : (
                                <div className="flex-1 flex gap-4">
                                  <select 
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32] bg-white"
                                    value={productFormData.cat1}
                                    onChange={(e) => setProductFormData({...productFormData, cat1: e.target.value, cat2: ''})}
                                  >
                                    <option value="">请选择一级分类</option>
                                    {Object.keys(PRODUCT_CATEGORIES).map(cat => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                  <select 
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32] bg-white"
                                    value={productFormData.cat2}
                                    onChange={(e) => setProductFormData({...productFormData, cat2: e.target.value})}
                                    disabled={!productFormData.cat1}
                                  >
                                    <option value="">请选择二级分类</option>
                                    {productFormData.cat1 && PRODUCT_CATEGORIES[productFormData.cat1].map(sub => (
                                      <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>

                            {/* Product Specification */}
                            <div className="flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>产品规格：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{productFormData.spec || 'C30'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入产品规格"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={productFormData.spec}
                                  onChange={(e) => setProductFormData({...productFormData, spec: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Brand */}
                            <div className="flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>品牌：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{productFormData.brand || '中建'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入品牌"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={productFormData.brand}
                                  onChange={(e) => setProductFormData({...productFormData, brand: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Production Batch */}
                            <div className="col-span-2 flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right leading-tight shrink-0">
                                <span className="text-red-500 mr-1">*</span>生产批次 (炉批号)：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{productFormData.batch || '20240301-01'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入生产批次 (炉批号)"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={productFormData.batch}
                                  onChange={(e) => setProductFormData({...productFormData, batch: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Qualification Materials */}
                            <div className="col-span-2 flex items-start gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right pt-2 shrink-0">
                                <span className="text-red-500 mr-1">*</span>资质材料：
                              </label>
                              <div className="flex-1 space-y-2">
                                {isPreview ? (
                                  <div className="text-sm text-blue-600 hover:underline cursor-pointer">资质材料.pdf</div>
                                ) : (
                                  <>
                                    <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#005a32] hover:text-[#005a32] transition-colors cursor-pointer bg-gray-50/50">
                                      <Plus size={24} />
                                      <span className="text-xs">上传文件</span>
                                    </div>
                                    <p className="text-xs text-gray-400">文件大小≤50M，支持多种格式 (pdf、word、图片格式、压缩包)</p>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Product Introduction */}
                            <div className="col-span-2 flex items-start gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right pt-2 shrink-0">
                                <span className="text-red-500 mr-1">*</span>商品介绍：
                              </label>
                              <div className="flex-1">
                                {isPreview ? (
                                  <div className="p-4 border border-gray-200 rounded min-h-[200px] text-sm text-gray-700 whitespace-pre-wrap bg-gray-50/30">
                                    {productFormData.intro || '这里是商品介绍内容...'}
                                  </div>
                                ) : (
                                  <div className="border border-gray-200 rounded overflow-hidden shadow-sm">
                                    {/* Mock Rich Text Toolbar */}
                                    <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-4">
                                      <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                                        <button className="p-1 hover:bg-gray-200 rounded font-bold w-8 h-8 flex items-center justify-center">B</button>
                                        <button className="p-1 hover:bg-gray-200 rounded italic w-8 h-8 flex items-center justify-center font-serif">I</button>
                                        <button className="p-1 hover:bg-gray-200 rounded underline w-8 h-8 flex items-center justify-center">U</button>
                                      </div>
                                      <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                                        <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
                                        <div className="w-6 h-6 bg-gray-400 rounded-sm"></div>
                                      </div>
                                      <div className="px-3 py-1 bg-white border border-gray-200 rounded text-xs text-gray-500 cursor-pointer hover:bg-gray-50">字体大小</div>
                                    </div>
                                    <textarea 
                                      placeholder="请输入商品介绍内容..."
                                      className="w-full p-4 h-64 text-sm focus:outline-none resize-none leading-relaxed"
                                      value={productFormData.intro}
                                      onChange={(e) => setProductFormData({...productFormData, intro: e.target.value})}
                                    ></textarea>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {/* Production Enterprise Name */}
                            <div className="col-span-2 flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>生产企业名称：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{equipmentFormData.manufacturer || '徐州徐工基础工程机械有限公司'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入生产企业名称"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={equipmentFormData.manufacturer}
                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, manufacturer: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Enterprise Address */}
                            <div className="col-span-2 flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>生产企业地址：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{equipmentFormData.address || '江苏省徐州市经济技术开发区'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入生产企业地址"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={equipmentFormData.address}
                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, address: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Enterprise Credit Code */}
                            <div className="flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>企业信用代码：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{equipmentFormData.creditCode || '91320301MA1X7B8L9X'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入企业信用代码"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={equipmentFormData.creditCode}
                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, creditCode: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Reporter */}
                            <div className="flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>填报人：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{equipmentFormData.reporter || '张三'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入填报人"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={equipmentFormData.reporter}
                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, reporter: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Contact Info */}
                            <div className="flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>联系方式：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{equipmentFormData.contactInfo || '13800138000'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入联系方式"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={equipmentFormData.contactInfo}
                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, contactInfo: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Production License No */}
                            <div className="flex items-center gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right shrink-0">
                                <span className="text-red-500 mr-1">*</span>特种设备生产许可证编号：
                              </label>
                              {isPreview ? (
                                <div className="flex-1 text-sm text-gray-900 font-medium">{equipmentFormData.licenseNo || 'TS2210G76-2025'}</div>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="请输入许可证编号"
                                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                  value={equipmentFormData.licenseNo}
                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, licenseNo: e.target.value})}
                                />
                              )}
                            </div>

                            {/* Production License Upload */}
                            <div className="flex items-start gap-4">
                              <label className="w-32 text-sm text-gray-600 text-right pt-2 shrink-0">
                                <span className="text-red-500 mr-1">*</span>特种设备生产许可证上传：
                              </label>
                              <div className="flex-1 space-y-2">
                                {isPreview ? (
                                  <div className="text-sm text-blue-600 hover:underline cursor-pointer">{equipmentFormData.licensePhoto || '生产许可证.pdf'}</div>
                                ) : (
                                  <>
                                    <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#005a32] hover:text-[#005a32] transition-colors cursor-pointer bg-gray-50/50">
                                      <Plus size={20} />
                                      <span className="text-[10px]">上传文件</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400">文件大小≤10M，支持pdf、word、图片、压缩包</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

              {/* Section - Steel Structure (Equipment Only) */}
              {(currentMenu === 'crane' || currentMenu === 'lift' || currentMenu === 'standard_part') && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4">
                  <button 
                    onClick={() => setSection2Open(!section2Open)}
                    className="w-full p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {currentMenu === 'standard_part' ? '标准节档案信息' : '主机档案信息'}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: section2Open ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={20} className="text-gray-400" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {section2Open && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8">
                          {currentMenu === 'standard_part' ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => {
                                      setEditingStandardPartIndex(null);
                                      setStandardPartModalData({ mainMachineNo: equipmentFormData.mainMachineNo || '', factoryCode: '', productionDate: '', type: '标准节', photo: '', history: '' });
                                      setShowStandardPartModal(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#005a32] text-white rounded text-sm hover:bg-[#004a2a] transition-colors"
                                  >
                                    <Plus size={16} />
                                    新增
                                  </button>
                                  <button 
                                    onClick={() => setShowImportModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors"
                                  >
                                    <Upload size={16} />
                                    批量导入
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setStandardSections(standardSections.filter(s => !selectedStandardSections.includes(s.id)));
                                      setSelectedStandardSections([]);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded text-sm hover:bg-red-100 transition-colors"
                                  >
                                    批量删除
                                  </button>
                                </div>
                              </div>

                              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                                    <tr>
                                      <th className="px-4 py-3 w-12">
                                        <input 
                                          type="checkbox" 
                                          checked={selectedStandardSections.length === standardSections.length && standardSections.length > 0}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedStandardSections(standardSections.map(s => s.id));
                                            } else {
                                              setSelectedStandardSections([]);
                                            }
                                          }}
                                          className="rounded border-gray-300 text-[#005a32] focus:ring-[#005a32]"
                                        />
                                      </th>
                                      <th className="px-4 py-3 w-16">序</th>
                                      <th className="px-4 py-3 min-w-[150px]">主机编号</th>
                                      <th className="px-4 py-3 min-w-[150px]"><span className="text-red-500 mr-1">*</span>类型</th>
                                      <th className="px-4 py-3 min-w-[200px]"><span className="text-red-500 mr-1">*</span>出厂编号</th>
                                      <th className="px-4 py-3 min-w-[150px]"><span className="text-red-500 mr-1">*</span>出厂日期</th>
                                      <th className="px-4 py-3 min-w-[150px]">历史绑定记录</th>
                                      <th className="px-4 py-3 min-w-[150px]">资质证明 / 照片</th>
                                      <th className="px-4 py-3 w-32 text-center">操作</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {standardSections.map((section, index) => (
                                      <tr key={section.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                          <input 
                                            type="checkbox" 
                                            checked={selectedStandardSections.includes(section.id)}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setSelectedStandardSections([...selectedStandardSections, section.id]);
                                              } else {
                                                setSelectedStandardSections(selectedStandardSections.filter(id => id !== section.id));
                                              }
                                            }}
                                            className="rounded border-gray-300 text-[#005a32] focus:ring-[#005a32]"
                                          />
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                        <td className="px-4 py-3">
                                          <span className="text-gray-900">{section.mainMachineNo || '--'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="text-gray-900">{section.type || '--'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="text-gray-900">{section.factoryCode || '--'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="text-gray-900">{section.productionDate || '--'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="text-gray-900">{section.history || '--'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                          {section.photo ? (
                                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                              <img src={section.photo} alt="资质" className="w-full h-full object-cover" />
                                            </div>
                                          ) : (
                                            <span className="text-gray-400 text-xs">未上传</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <div className="flex items-center justify-center gap-3">
                                            <button 
                                              onClick={() => {
                                                setEditingStandardPartIndex(index);
                                                setStandardPartModalData({ 
                                                  mainMachineNo: section.mainMachineNo || '',
                                                  factoryCode: section.factoryCode, 
                                                  productionDate: section.productionDate, 
                                                  type: section.type, 
                                                  photo: section.photo || '',
                                                  history: section.history || ''
                                                });
                                                setShowStandardPartModal(true);
                                              }}
                                              className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                              修改
                                            </button>
                                            <button 
                                              onClick={() => setStandardSections(standardSections.filter(s => s.id !== section.id))}
                                              className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                              删除
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {!isPreview && (
                                <div className="flex justify-start">
                                  <button 
                                    onClick={() => setShowImportModal(true)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#005a32] text-[#005a32] rounded-lg hover:bg-green-50 transition-colors font-medium shadow-sm"
                                  >
                                    <Upload size={18} />
                                    批量导入
                                  </button>
                                </div>
                              )}
                              <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                              <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                  <tr>
                                    <th className="px-4 py-4 w-16 text-center">序</th>
                                    <th className="px-4 py-4 w-64">类目</th>
                                    <th className="px-4 py-4 min-w-[200px]">档案信息</th>
                                    <th className="px-4 py-4 w-48">出厂日期</th>
                                    <th className="px-4 py-4 w-64">资质证明 / 照片</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                  {(currentMenu === 'lift' ? [
                                    { label: '设备类别', key: 'category', type: 'select' },
                                    { label: '设备品种', key: 'variety', type: 'select' },
                                    { label: '主机编号', key: 'factoryNo', type: 'input', hasDate: true, dateKey: 'factoryDate', photoKey: 'factoryCertPhoto', photoLabel: '产品合格证' },
                                    { label: '规格型号', key: 'testCertNo', type: 'input', photoKey: 'testReportPhoto', photoLabel: '型式试验报告' },
                                    { label: '吊笼', key: 'cageSection' },
                                    { label: '防坠安全器', key: 'safetyDeviceSection' },
                                    { label: '传动机构', key: 'driveUnitSection' },
                                  ] : [
                                    { label: '设备类别', key: 'category', type: 'select' },
                                    { label: '设备品种', key: 'variety', type: 'select' },
                                    { label: currentMenu === 'standard_part' ? '出厂编号' : '主机编号', key: 'factoryNo', type: 'input', hasDate: true, dateKey: 'factoryDate', photoKey: 'factoryCertPhoto', photoLabel: '产品合格证' },
                                    { label: '规格型号', key: 'testCertNo', type: 'input', photoKey: 'testReportPhoto', photoLabel: '型式试验报告' },
                                    { label: '上支座', key: 'upperSupport', hasDate: true, hasPhoto: true },
                                    { label: '下支座', key: 'lowerSupport', hasDate: true, hasPhoto: true },
                                    { label: '回转支承', key: 'slewingBearing', hasDate: true, hasPhoto: true },
                                    { label: '过渡节', key: 'transitionSection', hasDate: true, hasPhoto: true },
                                    { label: '爬升架（套架）', key: 'climbingFrame', hasDate: true, hasPhoto: true },
                                    { label: '支腿', key: 'outrigger', hasDate: true, hasPhoto: true },
                                    { label: '塔顶/A架', key: 'towerTop', hasDate: true, hasPhoto: true },
                                    { label: '小车', key: 'trolley', hasDate: true, hasPhoto: true, hint: '如后续因为大修更换不同，须附原厂安全证明，如为动臂塔吊不适用可用/表示' },
                                    { label: '吊钩', key: 'hook', hasDate: true, hasPhoto: true, hint: '如后续因为大修更换不同，须附原厂安全证明' },
                                    { label: '起升机构', key: 'hoistingMechanism', hasDate: true, hasPhoto: true },
                                    { label: '变幅机构', key: 'luffingMechanism', hasDate: true, hasPhoto: true },
                                    { label: '回转机构', key: 'slewingMechanism', hasDate: true, hasPhoto: true, hint: '如后续因为大修更换不同，须附原厂安全证明' },
                                    { label: '每一节起重臂', key: 'jibSection', hasDate: true, hasPhoto: true, hint: '如后续因为大修更换不同，须附原厂安全证明' },
                                    { label: '每一节平衡臂', key: 'counterJibSection', hasDate: true, hasPhoto: true },
                                  ]).map((item: any, index) => (
                                    <tr key={item.key} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="px-4 py-4 text-center text-gray-500">{index + 1}</td>
                                      <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1">
                                          <div className="font-medium text-gray-900">
                                            <span className="text-red-500 mr-1">*</span>{item.label}
                                          </div>
                                          {item.hint && !isPreview && <div className="text-[10px] text-amber-600 leading-tight">{item.hint}</div>}
                                        </div>
                                      </td>
                                      <td className="px-4 py-4" colSpan={['jibSection', 'counterJibSection', 'slewingMechanism', 'cageSection', 'safetyDeviceSection', 'driveUnitSection'].includes(item.key) ? 3 : 1}>
                                        {['jibSection', 'counterJibSection', 'slewingMechanism', 'cageSection', 'safetyDeviceSection', 'driveUnitSection'].includes(item.key) ? (
                                          <div className="flex flex-col gap-2">
                                            {!isPreview && (
                                              <div className="flex items-center gap-2 mb-1">
                                                <button 
                                                  onClick={() => {
                                                    setEditingJibIndex(null);
                                                    setJibModalData({ code: '', date: '', direction: '左', component: '电动机', photo: '' });
                                                    setJibModalType(item.key === 'jibSection' ? 'jib' : item.key === 'counterJibSection' ? 'counterJib' : item.key === 'slewingMechanism' ? 'slewing' : item.key === 'cageSection' ? 'cage' : item.key === 'driveUnitSection' ? 'driveUnit' : 'safetyDevice');
                                                    setShowJibModal(true);
                                                  }}
                                                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#005a32] text-white rounded hover:bg-[#004a29] transition-colors"
                                                >
                                                  <Plus size={14} /> 新增
                                                </button>
                                                <button 
                                                  onClick={() => handleBatchDeleteJib(item.key === 'jibSection' ? 'jib' : item.key === 'counterJibSection' ? 'counterJib' : item.key === 'slewingMechanism' ? 'slewing' : item.key === 'cageSection' ? 'cage' : item.key === 'driveUnitSection' ? 'driveUnit' : 'safetyDevice')}
                                                  disabled={(item.key === 'jibSection' ? selectedJibIndices : item.key === 'counterJibSection' ? selectedCounterJibIndices : item.key === 'slewingMechanism' ? selectedSlewingIndices : item.key === 'cageSection' ? selectedCageIndices : item.key === 'driveUnitSection' ? selectedDriveUnitIndices : selectedSafetyDeviceIndices).length === 0}
                                                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                  <Trash2 size={14} /> 批量删除
                                                </button>
                                              </div>
                                            )}
                                            <div className="border border-gray-100 rounded overflow-hidden">
                                              <table className="w-full text-xs">
                                                <thead className="bg-gray-50 text-gray-600">
                                                  <tr>
                                                    {!isPreview && (
                                                      <th className="px-2 py-1.5 w-8 text-center">
                                                        <input 
                                                          type="checkbox" 
                                                          checked={((equipmentFormData as any)[item.key === 'jibSection' ? 'jibSections' : item.key === 'counterJibSection' ? 'counterJibSections' : item.key === 'slewingMechanism' ? 'slewingMechanismSections' : item.key === 'cageSection' ? 'cageSections' : item.key === 'driveUnitSection' ? 'driveUnitSections' : 'safetyDeviceSections']).length > 0 && (item.key === 'jibSection' ? selectedJibIndices : item.key === 'counterJibSection' ? selectedCounterJibIndices : item.key === 'slewingMechanism' ? selectedSlewingIndices : item.key === 'cageSection' ? selectedCageIndices : item.key === 'driveUnitSection' ? selectedDriveUnitIndices : selectedSafetyDeviceIndices).length === ((equipmentFormData as any)[item.key === 'jibSection' ? 'jibSections' : item.key === 'counterJibSection' ? 'counterJibSections' : item.key === 'slewingMechanism' ? 'slewingMechanismSections' : item.key === 'cageSection' ? 'cageSections' : item.key === 'driveUnitSection' ? 'driveUnitSections' : 'safetyDeviceSections']).length}
                                                          onChange={(e) => {
                                                            const setSelection = item.key === 'jibSection' ? setSelectedJibIndices : item.key === 'counterJibSection' ? setSelectedCounterJibIndices : item.key === 'slewingMechanism' ? setSelectedSlewingIndices : item.key === 'cageSection' ? setSelectedCageIndices : item.key === 'driveUnitSection' ? setSelectedDriveUnitIndices : setSelectedSafetyDeviceIndices;
                                                            if (e.target.checked) {
                                                              setSelection(((equipmentFormData as any)[item.key === 'jibSection' ? 'jibSections' : item.key === 'counterJibSection' ? 'counterJibSections' : item.key === 'slewingMechanism' ? 'slewingMechanismSections' : item.key === 'cageSection' ? 'cageSections' : item.key === 'driveUnitSection' ? 'driveUnitSections' : 'safetyDeviceSections']).map((_: any, i: number) => i));
                                                            } else {
                                                              setSelection([]);
                                                            }
                                                          }}
                                                        />
                                                      </th>
                                                    )}
                                                    {['cageSection', 'safetyDeviceSection', 'driveUnitSection'].includes(item.key) ? (
                                                      <>
                                                        {item.key === 'driveUnitSection' && <th className="px-2 py-1.5 text-left font-medium">关键部件</th>}
                                                        <th className="px-2 py-1.5 text-left font-medium">编号</th>
                                                        <th className="px-2 py-1.5 text-left font-medium">方向</th>
                                                        <th className="px-2 py-1.5 text-left font-medium">出厂日期</th>
                                                        <th className="px-2 py-1.5 text-center font-medium w-32">资质证明/照片</th>
                                                        {!isPreview && <th className="px-2 py-1.5 text-center font-medium w-20">操作</th>}
                                                      </>
                                                    ) : (
                                                      <>
                                                        <th className="px-2 py-1.5 text-left font-medium">编号</th>
                                                        <th className="px-2 py-1.5 text-left font-medium">出厂日期</th>
                                                        <th className="px-2 py-1.5 text-center font-medium w-32">资质证明/照片</th>
                                                        {!isPreview && <th className="px-2 py-1.5 text-center font-medium w-20">操作</th>}
                                                      </>
                                                    )}
                                                  </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                  {((equipmentFormData as any)[item.key === 'jibSection' ? 'jibSections' : item.key === 'counterJibSection' ? 'counterJibSections' : item.key === 'slewingMechanism' ? 'slewingMechanismSections' : item.key === 'cageSection' ? 'cageSections' : item.key === 'driveUnitSection' ? 'driveUnitSections' : 'safetyDeviceSections']).length > 0 ? (
                                                    ((equipmentFormData as any)[item.key === 'jibSection' ? 'jibSections' : item.key === 'counterJibSection' ? 'counterJibSections' : item.key === 'slewingMechanism' ? 'slewingMechanismSections' : item.key === 'cageSection' ? 'cageSections' : item.key === 'driveUnitSection' ? 'driveUnitSections' : 'safetyDeviceSections']).map((section: any, i: number) => (
                                                      <tr key={section.id} className="hover:bg-gray-50/50">
                                                        {!isPreview && (
                                                          <td className="px-2 py-1.5 text-center">
                                                            <input 
                                                              type="checkbox" 
                                                              checked={(item.key === 'jibSection' ? selectedJibIndices : item.key === 'counterJibSection' ? selectedCounterJibIndices : item.key === 'slewingMechanism' ? selectedSlewingIndices : item.key === 'cageSection' ? selectedCageIndices : item.key === 'driveUnitSection' ? selectedDriveUnitIndices : selectedSafetyDeviceIndices).includes(i)}
                                                              onChange={(e) => {
                                                                const setSelection = item.key === 'jibSection' ? setSelectedJibIndices : item.key === 'counterJibSection' ? setSelectedCounterJibIndices : item.key === 'slewingMechanism' ? setSelectedSlewingIndices : item.key === 'cageSection' ? setSelectedCageIndices : item.key === 'driveUnitSection' ? setSelectedDriveUnitIndices : setSelectedSafetyDeviceIndices;
                                                                const currentSelection = item.key === 'jibSection' ? selectedJibIndices : item.key === 'counterJibSection' ? selectedCounterJibIndices : item.key === 'slewingMechanism' ? selectedSlewingIndices : item.key === 'cageSection' ? selectedCageIndices : item.key === 'driveUnitSection' ? selectedDriveUnitIndices : selectedSafetyDeviceIndices;
                                                                if (e.target.checked) {
                                                                  setSelection([...currentSelection, i]);
                                                                } else {
                                                                  setSelection(currentSelection.filter(idx => idx !== i));
                                                                }
                                                              }}
                                                            />
                                                          </td>
                                                        )}
                                                        {['cageSection', 'safetyDeviceSection', 'driveUnitSection'].includes(item.key) ? (
                                                          <>
                                                            {item.key === 'driveUnitSection' && <td className="px-2 py-1.5 text-gray-700">{section.component || '-'}</td>}
                                                            <td className="px-2 py-1.5 text-gray-700">{section.code}</td>
                                                            <td className="px-2 py-1.5 text-gray-700">{section.direction}</td>
                                                            <td className="px-2 py-1.5 text-gray-700">{section.date}</td>
                                                            <td className="px-2 py-1.5 text-center">
                                                              {section.photo ? (
                                                                <div className="flex items-center justify-center gap-1 text-[10px] text-[#005a32] bg-[#005a32]/5 px-2 py-1 rounded border border-[#005a32]/20">
                                                                  <span className="truncate max-w-[80px]">{section.photo}</span>
                                                                </div>
                                                              ) : (
                                                                <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-gray-50 text-gray-600 border border-gray-200 rounded hover:bg-gray-100 transition-colors">
                                                                  <Upload size={10} /> 上传
                                                                  <input 
                                                                    type="file" 
                                                                    className="hidden" 
                                                                    onChange={(e) => {
                                                                      const file = e.target.files?.[0];
                                                                      if (file) {
                                                                        const sectionKey = item.key === 'cageSection' ? 'cageSections' : item.key === 'safetyDeviceSection' ? 'safetyDeviceSections' : 'driveUnitSections';
                                                                        const newSections = [...(equipmentFormData as any)[sectionKey]];
                                                                        newSections[i] = { ...newSections[i], photo: file.name };
                                                                        setEquipmentFormData({ ...equipmentFormData, [sectionKey]: newSections });
                                                                      }
                                                                    }}
                                                                  />
                                                                </label>
                                                              )}
                                                            </td>
                                                            {!isPreview && (
                                                              <td className="px-2 py-1.5 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                  <button 
                                                                    onClick={() => {
                                                                      setEditingJibIndex(i);
                                                                      setJibModalData({ code: section.code, date: section.date, direction: section.direction || '左', component: section.component || '电动机', photo: section.photo || '' });
                                                                      setJibModalType(item.key === 'cageSection' ? 'cage' : item.key === 'safetyDeviceSection' ? 'safetyDevice' : 'driveUnit');
                                                                      setShowJibModal(true);
                                                                    }}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                  >
                                                                    <Edit3 size={12} />
                                                                  </button>
                                                                  <button 
                                                                    onClick={() => handleDeleteJib(item.key === 'cageSection' ? 'cage' : item.key === 'safetyDeviceSection' ? 'safetyDevice' : 'driveUnit', i)}
                                                                    className="text-red-600 hover:text-red-800"
                                                                  >
                                                                    <Trash2 size={12} />
                                                                  </button>
                                                                </div>
                                                              </td>
                                                            )}
                                                          </>
                                                        ) : (
                                                          <>
                                                            <td className="px-2 py-1.5 text-gray-700">{section.code}</td>
                                                            <td className="px-2 py-1.5 text-gray-700">{section.date}</td>
                                                            <td className="px-2 py-1.5 text-center">
                                                              {section.photo ? (
                                                                <div className="flex items-center justify-center gap-1 text-[10px] text-[#005a32] bg-[#005a32]/5 px-2 py-1 rounded border border-[#005a32]/20">
                                                                  <span className="truncate max-w-[80px]">{section.photo}</span>
                                                                </div>
                                                              ) : (
                                                                <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-gray-50 text-gray-600 border border-gray-200 rounded hover:bg-gray-100 transition-colors">
                                                                  <Upload size={10} /> 上传
                                                                  <input 
                                                                    type="file" 
                                                                    className="hidden" 
                                                                    onChange={(e) => {
                                                                      const file = e.target.files?.[0];
                                                                      if (file) {
                                                                        const sectionKey = item.key === 'jibSection' ? 'jibSections' : item.key === 'counterJibSection' ? 'counterJibSections' : 'slewingMechanismSections';
                                                                        const newSections = [...(equipmentFormData as any)[sectionKey]];
                                                                        newSections[i] = { ...newSections[i], photo: file.name };
                                                                        setEquipmentFormData({ ...equipmentFormData, [sectionKey]: newSections });
                                                                      }
                                                                    }}
                                                                  />
                                                                </label>
                                                              )}
                                                            </td>
                                                            {!isPreview && (
                                                              <td className="px-2 py-1.5 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                  <button 
                                                                    onClick={() => {
                                                                      setEditingJibIndex(i);
                                                                      setJibModalData({ code: section.code, date: section.date, direction: section.direction || '左', component: section.component || '电动机', photo: section.photo || '' });
                                                                      setJibModalType(item.key === 'jibSection' ? 'jib' : item.key === 'counterJibSection' ? 'counterJib' : 'slewing');
                                                                      setShowJibModal(true);
                                                                    }}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                  >
                                                                    <Edit3 size={12} />
                                                                  </button>
                                                                  <button 
                                                                    onClick={() => handleDeleteJib(item.key === 'jibSection' ? 'jib' : item.key === 'counterJibSection' ? 'counterJib' : 'slewing', i)}
                                                                    className="text-red-600 hover:text-red-800"
                                                                  >
                                                                    <Trash2 size={12} />
                                                                  </button>
                                                                </div>
                                                              </td>
                                                            )}
                                                          </>
                                                        )}
                                                      </tr>
                                                    ))
                                                  ) : (
                                                    <tr>
                                                      <td 
                                                        colSpan={
                                                          isPreview 
                                                            ? (['cageSection', 'safetyDeviceSection', 'driveUnitSection'].includes(item.key) ? 5 : 2)
                                                            : (['cageSection', 'safetyDeviceSection', 'driveUnitSection'].includes(item.key) ? 6 : 3)
                                                        } 
                                                        className="px-2 py-4 text-center text-gray-400 italic"
                                                      >
                                                        暂无数据
                                                      </td>
                                                    </tr>
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        ) : item.type === 'select' ? (
                                          isPreview ? (
                                            <div className="text-sm text-gray-900 font-medium">{(equipmentFormData as any)[item.key]}</div>
                                          ) : (
                                            <select 
                                              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32] bg-white"
                                              value={(equipmentFormData as any)[item.key]}
                                              onChange={(e) => {
                                                const newData = { ...equipmentFormData, [item.key]: e.target.value };
                                                if (item.key === 'category') {
                                                  newData.variety = (EQUIPMENT_HIERARCHY[e.target.value] && EQUIPMENT_HIERARCHY[e.target.value][0]) || '';
                                                }
                                                setEquipmentFormData(newData);
                                              }}
                                            >
                                              {(item.key === 'category' 
                                                ? (currentMenu === 'lift' ? ['施工升降机'] : currentMenu === 'crane' ? ['塔式起重机'] : Object.keys(EQUIPMENT_HIERARCHY).filter(cat => cat !== '升降机' && cat !== '标准节' && cat !== '施工升降机')) 
                                                : (EQUIPMENT_HIERARCHY[equipmentFormData.category] || [])
                                              ).map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                              ))}
                                            </select>
                                          )
                                        ) : item.type === 'input' ? (
                                          isPreview ? (
                                            <div className="text-sm text-gray-900 font-medium">{(equipmentFormData as any)[item.key] || '--'}</div>
                                          ) : (
                                            <input 
                                              type="text" 
                                              placeholder={`请输入${item.label}`}
                                              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                              value={(equipmentFormData as any)[item.key]}
                                              onChange={(e) => setEquipmentFormData({...equipmentFormData, [item.key]: e.target.value})}
                                            />
                                          )
                                        ) : item.hasDate || item.key === 'factoryDate' ? (
                                          item.key === 'factoryDate' ? (
                                            <span className="text-gray-400">--</span>
                                          ) : (
                                            isPreview ? (
                                              <div className="text-sm text-gray-900 font-medium">{(equipmentFormData as any)[`${item.key}Code`] || '--'}</div>
                                            ) : (
                                              <input 
                                                type="text" 
                                                placeholder={`请输入${item.label}${(item.label === '小车' || item.label === '吊钩' ? '编码' : '编号')}`}
                                                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32]"
                                                value={(equipmentFormData as any)[`${item.key}Code`]}
                                                onChange={(e) => setEquipmentFormData({...equipmentFormData, [`${item.key}Code`]: e.target.value})}
                                              />
                                            )
                                          )
                                        ) : (
                                          <span className="text-gray-400">--</span>
                                        )}
                                      </td>
                                      {!['jibSection', 'counterJibSection', 'slewingMechanism', 'cageSection', 'safetyDeviceSection', 'driveUnitSection'].includes(item.key) && (
                                        <td className="px-4 py-4">
                                          {item.hasDate || item.type === 'date' || item.key === 'factoryDate' || item.dateKey ? (
                                            isPreview ? (
                                              <div className="text-sm text-gray-900 font-medium">{(equipmentFormData as any)[item.dateKey || (item.key === 'factoryDate' ? 'factoryDate' : `${item.key}Date`)] || '--'}</div>
                                            ) : (
                                              <input 
                                                type="date" 
                                                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#005a32] bg-white"
                                                value={(equipmentFormData as any)[item.dateKey || (item.key === 'factoryDate' ? 'factoryDate' : `${item.key}Date`)]}
                                                onChange={(e) => setEquipmentFormData({...equipmentFormData, [item.dateKey || (item.key === 'factoryDate' ? 'factoryDate' : `${item.key}Date`)]: e.target.value})}
                                              />
                                            )
                                          ) : (
                                            <span className="text-gray-400">--</span>
                                          )}
                                        </td>
                                      )}
                                      {!['jibSection', 'counterJibSection', 'slewingMechanism', 'cageSection', 'safetyDeviceSection', 'driveUnitSection'].includes(item.key) && (
                                        <td className="px-4 py-4">
                                          {item.hasPhoto || item.type === 'upload' || item.photoKey ? (
                                          isPreview ? (
                                            (item.type === 'upload' || item.photoKey) ? (
                                              <div className="text-sm text-blue-600 hover:underline cursor-pointer">{(equipmentFormData as any)[item.photoKey || item.key] || `${item.photoLabel || item.label}.pdf`}</div>
                                            ) : (
                                              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                                <img src="https://picsum.photos/seed/cert/100/100" alt={item.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                              </div>
                                            )
                                          ) : (
                                            <div className="flex items-center gap-2">
                                              <div className="w-10 h-10 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-[#005a32] hover:text-[#005a32] cursor-pointer bg-gray-50 transition-colors">
                                                <Plus size={16} />
                                              </div>
                                              <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-500">{item.photoLabel ? `上传${item.photoLabel}` : '上传文件'}</span>
                                                <span className="text-[10px] text-gray-400">≤10M</span>
                                              </div>
                                            </div>
                                          )
                                        ) : (
                                          <span className="text-gray-400">--</span>
                                        )}
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            </div>
          </div>
        )}
      </main>
      </div>

      {/* Floating Action (Mock) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-px bg-[#005a32] text-white rounded-l-lg overflow-hidden shadow-lg z-30">
        <button className="p-3 hover:bg-white/10 flex flex-col items-center gap-1">
          <div className="text-[10px] font-bold leading-none">快捷</div>
          <div className="text-[10px] font-bold leading-none">入口</div>
        </button>
        <div className="h-px bg-white/20 w-8 mx-auto"></div>
        <button className="p-3 hover:bg-white/10">
          <LayoutDashboard size={20} />
        </button>
        <button className="p-3 hover:bg-white/10">
          <Plus size={20} />
        </button>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentMenu === 'standard_part' ? '批量导入标准节' : '批量导入主机档案'}
                </h3>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-[#005a32] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Download size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">下载模板</div>
                        <div className="text-xs text-gray-500">
                          下载{currentMenu === 'standard_part' ? '标准节' : '主机档案'}导入Excel模板
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#005a32]" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-[#005a32] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Upload size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">上传模板</div>
                        <div className="text-xs text-gray-500">
                          上传填写好的{currentMenu === 'standard_part' ? '标准节' : '主机档案'}数据文件
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#005a32]" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-xs text-blue-700 leading-relaxed">
                    温馨提示：请先下载模板，按格式填写后再上传。支持 .xls, .xlsx 格式文件，单次导入上限 500 条。
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="px-8 py-2 bg-[#005a32] text-white rounded font-medium hover:bg-[#004d2c] transition-colors shadow-sm"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Jib Section Modal */}
        {showStandardPartModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingStandardPartIndex !== null ? '修改标准节' : '新增标准节'}
                </h3>
                <button 
                  onClick={() => setShowStandardPartModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus size={20} className="rotate-45 text-gray-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">主机编号</label>
                  <select 
                    value={standardPartModalData.mainMachineNo}
                    onChange={(e) => setStandardPartModalData({ ...standardPartModalData, mainMachineNo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                  >
                    <option value="">请选择主机编号</option>
                    {MOCK_EQUIPMENTS.filter(e => e.category !== '标准节').map(e => (
                      <option key={e.id} value={e.factoryNo}>{e.factoryNo} ({e.model})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">类型</label>
                  <select 
                    value={standardPartModalData.type}
                    onChange={(e) => setStandardPartModalData({ ...standardPartModalData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                  >
                    {(() => {
                      const machine = MOCK_EQUIPMENTS.find(e => e.code === standardPartModalData.mainMachineNo || e.factoryNo === standardPartModalData.mainMachineNo);
                      const isLift = machine?.category === '施工升降机';
                      if (isLift) {
                        return (
                          <>
                            <option value="标准节">标准节</option>
                            <option value="顶节">顶节</option>
                            <option value="底节">底节</option>
                            <option value="底座">底座</option>
                            <option value="附墙架">附墙架</option>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <option value="标准节">标准节</option>
                            <option value="基础节">基础节</option>
                            <option value="加强节">加强节</option>
                            <option value="支腿">支腿</option>
                          </>
                        );
                      }
                    })()}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">出厂编号</label>
                  <input 
                    type="text"
                    value={standardPartModalData.factoryCode}
                    onChange={(e) => setStandardPartModalData({ ...standardPartModalData, factoryCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                    placeholder="请输入出厂编号"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">出厂日期</label>
                  <input 
                    type="date"
                    value={standardPartModalData.productionDate}
                    onChange={(e) => setStandardPartModalData({ ...standardPartModalData, productionDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#005a32]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">资质证明 / 照片</label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => document.getElementById('standard-part-photo-upload')?.click()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-[#005a32] hover:text-[#005a32] transition-all"
                    >
                      <Upload size={18} />
                      <span className="text-sm">{standardPartModalData.photo ? '重新上传' : '上传文件'}</span>
                    </button>
                    {standardPartModalData.photo && (
                      <div className="relative w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 group">
                        <img src={standardPartModalData.photo} alt="预览" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setStandardPartModalData({ ...standardPartModalData, photo: '' })}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    <input 
                      id="standard-part-photo-upload"
                      type="file" 
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setStandardPartModalData({ ...standardPartModalData, photo: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowStandardPartModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
                <button 
                  onClick={() => handleSaveStandardPart()}
                  className="px-6 py-2 bg-[#005a32] text-white rounded-lg text-sm font-medium hover:bg-[#004a2a] transition-colors"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showBindingConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
                  <Bell className="text-yellow-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">绑定确认</h3>
                <p className="text-gray-500 text-sm">当前构件已绑定其他主机设备，是否继续绑定新主机设备？</p>
              </div>
              <div className="p-4 bg-gray-50 flex justify-center gap-3">
                <button 
                  onClick={() => setShowBindingConfirmModal(false)}
                  className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => handleSaveStandardPart(true)}
                  className="px-8 py-2 bg-[#005a32] text-white rounded-lg text-sm font-medium hover:bg-[#004a2a] transition-colors"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showNoDefaultInfoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
                  <Bell className="text-yellow-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">暂无默认企业信息</h3>
                <p className="text-gray-500 text-sm">请在“默认信息”中配置后再进行一键填入。</p>
              </div>
              <div className="p-4 bg-gray-50 flex justify-center">
                <button 
                  onClick={() => setShowNoDefaultInfoModal(false)}
                  className="px-8 py-2 bg-[#005a32] text-white rounded-lg text-sm font-medium hover:bg-[#004a2a] transition-colors"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showMachineSelectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[150] p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">选择主机编号</h3>
                <button 
                  onClick={() => setShowMachineSelectModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-[#005a32] mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-[#005a32] rounded-full"></div>
                      塔式起重机
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MOCK_EQUIPMENTS.filter(e => e.category === '塔式起重机').map(e => (
                        <button
                          key={e.id}
                          onClick={() => {
                            setEquipmentFormData({ ...equipmentFormData, mainMachineNo: e.code || e.factoryNo });
                            setShowMachineSelectModal(false);
                          }}
                          className="flex flex-col p-4 border border-gray-100 rounded-xl hover:border-[#005a32] hover:bg-[#f0f9f4] transition-all text-left group"
                        >
                          <span className="text-sm font-bold text-gray-900 group-hover:text-[#005a32]">{e.code || e.factoryNo}</span>
                          <span className="text-xs text-gray-500 mt-1">{e.variety} - {e.model}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#005a32] mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-[#005a32] rounded-full"></div>
                      施工升降机
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MOCK_EQUIPMENTS.filter(e => e.category === '施工升降机').map(e => (
                        <button
                          key={e.id}
                          onClick={() => {
                            setEquipmentFormData({ ...equipmentFormData, mainMachineNo: e.code || e.factoryNo });
                            setShowMachineSelectModal(false);
                          }}
                          className="flex flex-col p-4 border border-gray-100 rounded-xl hover:border-[#005a32] hover:bg-[#f0f9f4] transition-all text-left group"
                        >
                          <span className="text-sm font-bold text-gray-900 group-hover:text-[#005a32]">{e.code || e.factoryNo}</span>
                          <span className="text-xs text-gray-500 mt-1">{e.variety} - {e.model}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setShowMachineSelectModal(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showDefaultInfoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">默认信息设置</h3>
                <button 
                  onClick={() => setShowDefaultInfoModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">生产企业名称</label>
                  <input 
                    type="text"
                    value={defaultInfoData.enterpriseName}
                    onChange={(e) => setDefaultInfoData({ ...defaultInfoData, enterpriseName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all"
                    placeholder="请输入生产企业名称"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">生产企业地址</label>
                  <input 
                    type="text"
                    value={defaultInfoData.address}
                    onChange={(e) => setDefaultInfoData({ ...defaultInfoData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all"
                    placeholder="请输入生产企业地址"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">企业信用代码</label>
                  <input 
                    type="text"
                    value={defaultInfoData.creditCode}
                    onChange={(e) => setDefaultInfoData({ ...defaultInfoData, creditCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all"
                    placeholder="请输入企业信用代码"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">填报人</label>
                  <input 
                    type="text"
                    value={defaultInfoData.reporter}
                    onChange={(e) => setDefaultInfoData({ ...defaultInfoData, reporter: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all"
                    placeholder="请输入填报人"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">联系方式</label>
                  <input 
                    type="text"
                    value={defaultInfoData.contactInfo}
                    onChange={(e) => setDefaultInfoData({ ...defaultInfoData, contactInfo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all"
                    placeholder="请输入联系方式"
                  />
                </div>
              </div>

              <div className="px-8 py-6 bg-gray-50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowDefaultInfoModal(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setShowDefaultInfoModal(false);
                  }}
                  className="px-6 py-2 bg-[#005a32] text-white rounded-lg text-sm font-medium hover:bg-[#004a2a] transition-colors"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showJibModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingJibIndex !== null ? '编辑' : '新增'}
                  {jibModalType === 'jib' ? '起重臂节' : jibModalType === 'counterJib' ? '平衡臂节' : jibModalType === 'slewing' ? '回转机构' : jibModalType === 'cage' ? '吊笼' : jibModalType === 'driveUnit' ? '传动机构' : '防坠安全器'}
                </h3>
                <button 
                  onClick={() => setShowJibModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {jibModalType === 'driveUnit' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span> 关键部件
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all bg-white"
                      value={jibModalData.component}
                      onChange={(e) => setJibModalData({ ...jibModalData, component: e.target.value })}
                    >
                      <option value="电动机">电动机</option>
                      <option value="减速机">减速机</option>
                    </select>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                    <span className="text-red-500">*</span> 编号
                  </label>
                  <input 
                    type="text" 
                    placeholder={`请输入${jibModalType === 'jib' ? '起重臂节' : jibModalType === 'counterJib' ? '平衡臂节' : jibModalType === 'slewing' ? '回转机构' : jibModalType === 'cage' ? '吊笼' : jibModalType === 'driveUnit' ? '传动机构' : '防坠安全器'}编号`}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all"
                    value={jibModalData.code}
                    onChange={(e) => setJibModalData({ ...jibModalData, code: e.target.value })}
                  />
                </div>
                {(jibModalType === 'cage' || jibModalType === 'safetyDevice' || jibModalType === 'driveUnit') && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span> 方向
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all bg-white"
                      value={jibModalData.direction}
                      onChange={(e) => setJibModalData({ ...jibModalData, direction: e.target.value })}
                    >
                      <option value="左">左</option>
                      <option value="右">右</option>
                    </select>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                    <span className="text-red-500">*</span> 出厂日期
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a32]/20 focus:border-[#005a32] transition-all bg-white"
                    value={jibModalData.date}
                    onChange={(e) => setJibModalData({ ...jibModalData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                    资质证明 / 照片
                  </label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => document.getElementById('jib-photo-upload')?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 transition-all"
                    >
                      <Upload size={16} />
                      {jibModalData.photo ? '重新上传' : '上传文件'}
                    </button>
                    {jibModalData.photo && (
                      <div className="flex items-center gap-2 text-xs text-[#005a32] bg-[#005a32]/5 px-2 py-1 rounded">
                        <span>已选择文件</span>
                        <button 
                          onClick={() => setJibModalData({ ...jibModalData, photo: '' })}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Plus size={12} className="rotate-45" />
                        </button>
                      </div>
                    )}
                    <input 
                      id="jib-photo-upload"
                      type="file" 
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setJibModalData({ ...jibModalData, photo: file.name });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowJibModal(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddJib}
                  disabled={!jibModalData.code || !jibModalData.date}
                  className="px-8 py-2.5 bg-[#005a32] text-white rounded-lg font-bold hover:bg-[#004d2c] transition-all shadow-lg shadow-[#005a32]/20 disabled:opacity-50 disabled:shadow-none"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Overlays (Mock) - Removed as we now use full-page views */}
    </div>
  );
}
