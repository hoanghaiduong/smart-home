
import React, { useState, useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { Table, type Column } from './common/Table';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { Checkbox } from './common/Checkbox';
import { ConfirmationDialog } from './common/ConfirmationDialog';
import type { Camera, CameraType, Room } from '../types';
import { CameraStatusBadge } from './common/CameraStatusBadge';

interface CameraManagementProps {
    cameras: Camera[];
    rooms: Room[];
    onAdd: (cameraData: Omit<Camera, 'id' | 'status'>) => void;
    onUpdate: (cameraId: string, cameraData: Partial<Omit<Camera, 'id'>>) => void;
    onDelete: (cameraId: string) => void;
}

type CameraWithRoom = Camera & { roomName?: string };

export const CameraManagement: React.FC<CameraManagementProps> = ({ cameras, rooms, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
    const [cameraToDelete, setCameraToDelete] = useState<Camera | null>(null);

    const camerasWithRoom: CameraWithRoom[] = useMemo(() => {
        return cameras.map(camera => ({
            ...camera,
            roomName: rooms.find(r => r.id === camera.roomId)?.name,
        }));
    }, [cameras, rooms]);

    const columns: Column<CameraWithRoom>[] = useMemo(() => [
        { header: 'Tên Camera', accessor: 'name', isSortable: true },
        { header: 'Phòng', accessor: 'roomName', isSortable: true, render: (cam) => cam.roomName || 'N/A' },
        { header: 'Loại', accessor: 'type', isSortable: true, render: (cam) => <span className="uppercase">{cam.type}</span> },
        { header: 'Trạng thái', accessor: 'status', isSortable: true, render: (cam) => <CameraStatusBadge status={cam.status} /> },
        { header: 'Mặc định', accessor: 'isDefault', render: (cam) => cam.isDefault ? '✔️' : '' },
        { header: 'Hành động', accessor: 'actions', render: (camera) => (
            <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(camera)}>Sửa</Button>
                <Button size="sm" variant="danger" onClick={() => setCameraToDelete(camera)}>Xoá</Button>
            </div>
        )}
    ], [rooms]);

    const handleEdit = (camera: Camera) => {
        setEditingCamera(camera);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCamera(null);
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCamera(null);
    };
    
    const handleSave = (formData: any) => {
        const dataToSave = {
            ...formData,
            roomId: parseInt(formData.roomId, 10),
        }
        if (editingCamera) {
            onUpdate(editingCamera.id, dataToSave);
        } else {
            onAdd(dataToSave);
        }
        handleCloseModal();
    };

    const handleDeleteConfirm = () => {
        if (cameraToDelete) {
            onDelete(cameraToDelete.id);
            setCameraToDelete(null);
        }
    }

    return (
        <>
            <GlassCard>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Quản lý Camera</h2>
                    <Button onClick={handleAddNew}>Thêm Camera mới</Button>
                </div>
                <Table
                    columns={columns}
                    data={camerasWithRoom}
                    searchKeys={['name', 'roomName']}
                />
            </GlassCard>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCamera ? 'Chỉnh sửa Camera' : 'Thêm Camera mới'}
            >
                <CameraForm
                    initialData={editingCamera}
                    rooms={rooms}
                    onSubmit={handleSave}
                    onCancel={handleCloseModal}
                />
            </Modal>
            
            <ConfirmationDialog
                isOpen={!!cameraToDelete}
                onClose={() => setCameraToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xoá camera"
                message={`Bạn có chắc chắn muốn xoá camera "${cameraToDelete?.name}" không?`}
            />
        </>
    );
};

// --- Camera Form Sub-component ---
interface CameraFormProps {
    initialData?: Camera | null;
    rooms: Room[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const CameraForm: React.FC<CameraFormProps> = ({ initialData, rooms, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        roomId: initialData?.roomId.toString() || (rooms.length > 0 ? rooms[0].id.toString() : ''),
        type: initialData?.type || 'ip',
        streamUrl: initialData?.streamUrl || '',
        isDefault: initialData?.isDefault || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const roomOptions = rooms.map(r => ({ value: r.id.toString(), label: r.name }));
    const cameraTypeOptions: { value: CameraType, label: string }[] = [
        { value: 'ip', label: 'IP Camera (HTTP MJPEG)' },
        { value: 'rtsp', label: 'RTSP Stream' },
        { value: 'esp32', label: 'ESP32-CAM' },
        { value: 'local', label: 'Local/Placeholder' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Tên Camera" id="name" name="name" value={formData.name} onChange={handleChange} required />
            <Select label="Phòng" id="roomId" name="roomId" value={formData.roomId} onChange={handleChange} options={roomOptions} required />
            <Select label="Loại Camera" id="type" name="type" value={formData.type} onChange={handleChange} options={cameraTypeOptions} required />
            <Input label="Stream URL" id="streamUrl" name="streamUrl" value={formData.streamUrl} onChange={handleChange} placeholder="rtsp://..." required />
            <Checkbox label="Đặt làm camera mặc định trên dashboard" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} />

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Huỷ</Button>
                <Button type="submit">Lưu</Button>
            </div>
        </form>
    );
};
