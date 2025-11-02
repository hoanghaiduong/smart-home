import React, { useState, useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { Table, type Column } from './common/Table';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { ConfirmationDialog } from './common/ConfirmationDialog';
import type { Room, Device, DeviceType } from '../types';

interface DeviceManagementProps {
    rooms: Room[];
    onAdd: (roomId: number, deviceData: { name: string, type: DeviceType }) => void;
    onUpdate: (roomId: number, deviceId: string, deviceData: Partial<Device>) => void;
    onDelete: (roomId: number, deviceId: string) => void;
}

type DeviceWithRoom = Device & { roomName: string; roomId: number };

export const DeviceManagement: React.FC<DeviceManagementProps> = ({ rooms, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState<DeviceWithRoom | null>(null);
    const [deviceToDelete, setDeviceToDelete] = useState<DeviceWithRoom | null>(null);

    const allDevices: DeviceWithRoom[] = useMemo(() => {
        return rooms.flatMap(room => 
            room.devices.map(device => ({
                ...device,
                roomName: room.name,
                roomId: room.id,
            }))
        );
    }, [rooms]);
    
    const columns: Column<DeviceWithRoom>[] = useMemo(() => [
        { header: 'Tên thiết bị', accessor: 'name', isSortable: true },
        { header: 'Loại', accessor: 'type', isSortable: true, render: (d) => <span className="capitalize">{d.type}</span> },
        { header: 'Phòng', accessor: 'roomName', isSortable: true },
        { header: 'Trạng thái', accessor: 'state', isSortable: true, render: (d) => (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${d.state === 'on' ? 'bg-green-500/20 text-green-500' : 'bg-slate-500/20 text-slate-500'}`}>
                {d.state === 'on' ? 'Bật' : 'Tắt'}
            </span>
        )},
        { header: 'Hành động', accessor: 'actions', render: (device) => (
            <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleEdit(device); }}>Sửa</Button>
                <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); setDeviceToDelete(device); }}>Xoá</Button>
            </div>
        )}
    ], [rooms]);

    const handleEdit = (device: DeviceWithRoom) => {
        setEditingDevice(device);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingDevice(null);
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDevice(null);
    };
    
    const handleSave = (formData: Record<string, any>) => {
        const { roomId, name, type } = formData;
        if (editingDevice) {
            onUpdate(editingDevice.roomId, editingDevice.id, { name }); // Simple name update for now
        } else {
            onAdd(parseInt(roomId), { name, type });
        }
        handleCloseModal();
    };

    const handleDeleteConfirm = () => {
        if (deviceToDelete) {
            onDelete(deviceToDelete.roomId, deviceToDelete.id);
            setDeviceToDelete(null);
        }
    }

    const roomOptions = rooms.map(r => ({ value: r.id.toString(), label: r.name }));
    const deviceTypeOptions: { value: DeviceType, label: string }[] = [
        { value: 'light', label: 'Đèn (Light)' },
        { value: 'fan', label: 'Quạt (Fan)' },
        { value: 'ac', label: 'Máy lạnh (AC)' },
        { value: 'curtain', label: 'Rèm (Curtain)' },
    ];


    return (
        <>
            <GlassCard>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Quản lý thiết bị (Device Management)</h2>
                    <Button onClick={handleAddNew}>Thêm thiết bị mới</Button>
                </div>
                <Table
                    columns={columns}
                    data={allDevices}
                    searchKeys={['name', 'roomName']}
                    filterOptions={[
                        { key: 'roomName', label: 'Phòng', options: roomOptions.map(r => r.label) },
                        { key: 'type', label: 'Loại', options: deviceTypeOptions.map(t => t.value) },
                    ]}
                />
            </GlassCard>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingDevice ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
            >
                <DeviceForm
                    initialData={editingDevice}
                    onSubmit={handleSave}
                    onCancel={handleCloseModal}
                    roomOptions={roomOptions}
                    deviceTypeOptions={deviceTypeOptions}
                />
            </Modal>
            
            <ConfirmationDialog
                isOpen={!!deviceToDelete}
                onClose={() => setDeviceToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xoá thiết bị"
                message={`Bạn có chắc chắn muốn xoá thiết bị "${deviceToDelete?.name}" không?`}
            />
        </>
    );
};

interface DeviceFormProps {
    initialData?: DeviceWithRoom | null;
    onSubmit: (data: Record<string, any>) => void;
    onCancel: () => void;
    roomOptions: { value: string; label: string }[];
    deviceTypeOptions: { value: string; label: string }[];
}

const DeviceForm: React.FC<DeviceFormProps> = ({ initialData, onSubmit, onCancel, roomOptions, deviceTypeOptions }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        type: initialData?.type || 'light',
        roomId: initialData?.roomId.toString() || (roomOptions.length > 0 ? roomOptions[0].value : ''),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Tên thiết bị"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <Select
                label="Loại thiết bị"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={deviceTypeOptions}
                disabled={!!initialData}
                required
            />
             <Select
                label="Phòng"
                id="roomId"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                options={roomOptions}
                disabled={!!initialData}
                required
            />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Huỷ</Button>
                <Button type="submit">Lưu</Button>
            </div>
        </form>
    );
};
